// unknowncheats.me reputation bot
//
// by: otvv and danielsrbastos
// license: MIT

// import modules
const Firefox = require('selenium-webdriver/firefox')
const { Builder, By, Key, until } = require('selenium-webdriver')
const random = require('random')

const { accounts } = require('./config/accounts.json')
const messages = require('./config/messages.json');

(async function main() {

  const webDriver = new Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(new Firefox.Options().headless())
    .build()

  // handle environment variables
  const repArguments = process.argv.splice(2)

  // post id (first variable)
  const postID = repArguments[0]

  // reputation type
  const repType = repArguments[1]

  // give custom reputation reason (second variable)
  const giveReason = repArguments[2] == true ? true : false

  // open main unknowncheats page
  await webDriver.get('https://www.unknowncheats.me/forum/index.php')

  // username
  await webDriver.findElement(By.id('navbar_username')).sendKeys('username')

  // password
  await webDriver.findElement(By.id('Password1')).sendKeys('password', Key.RETURN)

  // check if the account was logged in
  await webDriver.wait(until.urlIs('https://www.unknowncheats.me/forum/login.php'))

  try {

    // check if the username is correct before proceeding
    await webDriver.findElement(By.xpath('//*[contains(text(), "invalid username or password")]'))

    // debug purposes only
    console.log('[UC-REP] - invalid account credentials')

    return
  } catch (e) {

    // debug purposeso only
    console.log('[UC-REP] - account logged in.')
  }

  // open post to give reputation
  await webDriver.get('https://www.unknowncheats.me/forum/' + postID + '-post.html')

  // wait to load all elements
  await webDriver.wait(until.urlIs('https://www.unknowncheats.me/forum/' + postID + '-post.html'))

  try {

    // check if the post id is valid
    await webDriver.findElement(By.xpath('//*[contains(text(), "Invalid Post specified")]'))

    // debug purposes only
    console.log('[UC-REP] - invalid post id')

    return
  } catch (e) {

    // debug purposes only
    console.log('[UC-REP] - found post id: ' + postID)

  }

  let message = ''

  // check which type of rep we're going to add
  if (repType === 'positive') {

    message = messages.pos_reason[random.int(0, messages.pos_reason.length)]

    // debug purposes only
    console.log('[UC-REP] - giving positive rep.')

    // open reputation box
    await webDriver.findElement(By.id('reputation_' + postID + '-pos')).click()
  }
  else if (repType === 'negative') {

    message = messages.neg_reason[random.int(0, messages.neg_reason.length)]

    // debug purposes only
    console.log('[UC-REP] - giving negative rep.')

    // open reputation box
    await webDriver.findElement(By.id('reputation_' + postID + '-neg')).click()
  }

  try {

    // check for modal alerts
    await webDriver.wait(until.alertIsPresent(), 1000)

    // debug purposes only
    console.log('[UC-REP] - reputation already given to that user')

    return
  } catch (e) { }

  // check arguments
  if (giveReason) {
    // write a random reputation reason 
    await webDriver.findElement(By.id('reason_' + postID)).sendKeys(message)

    // debug purposes only
    console.log('[UC-REP] - wrote reputation reason.')
  }
  else {

    // debug purposes only
    console.log('[UC-REP] - we are going without a reputation reason.')
  }

  // give the post reputation
  await webDriver.findElement(By.id('reputationsubmit_' + postID)).click()

  // debug purposeso only
  console.log('[UC-REP] - rep given.')

  // todo: repeat the process with other account 

})()
