// unknowncheats.me reputation bot
//
// by: otvv and danielsrbastos
// license: MIT

// modules
const { Builder, By, Key, until } = require('selenium-webdriver')
const Firefox = require('selenium-webdriver/firefox')
const Random = require('random')
const colorPrint = require('colorprint')

// external configs
const accountsJSON = require('./config/accounts.json');
const messagesJSON = require('./config/messages.json');

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

  colorPrint.trace('[UC-REP] - opening main page')

  // open main unknowncheats page
  await webDriver.get('https://www.unknowncheats.me/forum/index.php')

  // check for cloudflare captcha
  const isCloudFlare = await webDriver.wait(until.titleIs('Attention Required! | Cloudflare'))
    
  if (isCloudFlare) {

    colorPrint.fatal('[UC-REP] - cloud flare captcha detected. Please try again.')
      
    // exit
    webDriver.quit();
  }

  // check if the main poge is loaded
  const isMainPageLoaded = await webDriver.wait(until.urlIs('https://www.unknowncheats.me/forum/index.php'))

  if (isMainPageLoaded) {

    colorPrint.trace('[UC-REP] - main page opened')
    
    // username
    await webDriver.findElement(By.id('navbar_username')).sendKeys('username_here')
    
    // password
    await webDriver.findElement(By.id('Password1')).sendKeys('password_here', Key.RETURN)
    
    colorPrint.trace('[UC-REP] - attempting to log in')

    // check if the account was logged in
    await webDriver.wait(until.urlIs('https://www.unknowncheats.me/forum/login.php'))

    try {
 
      // check if the username is correct before proceeding
      await webDriver.findElement(By.xpath('//*[contains(text(), "invalid username or password")]'))

      colorPrint.fatal('[UC-REP] - invalid account credentials')

      // exit
      webDriver.quit();
    } catch (e) { }

    colorPrint.trace('[UC-REP] - account logged in')

    // open post to give reputation
    await webDriver.get('https://www.unknowncheats.me/forum/' + postID + '-post.html')

    // wait for it to load all elements
    await webDriver.wait(until.urlIs('https://www.unknowncheats.me/forum/' + postID + '-post.html'))

    try {

      // check if the post id is valid
      await webDriver.findElement(By.xpath('//*[contains(text(), "Invalid Post specified")]'))

      colorPrint.fatal('[UC-REP] - unknown post id')

      // exit
      webDriver.quit();
    } catch (e) { }

    colorPrint.trace('[UC-REP] - found post id: ' + postID)

    // store random reputation messages
    let message = ''

    // check which type of rep we're going to add
    if (repType === 'positive') {

      message = messagesJSON.Positive[Random.int(0, messagesJSON.Positive.length)] // TODO: fix potential crash

      colorPrint.info('[UC-REP] - giving positive rep')

      // open reputation box
      await webDriver.findElement(By.id('reputation_' + postID + '-pos')).click()
    }

    else if (repType === 'negative') {

      message = messagesJSON.Negative[Random.int(0, messagesJSON.Negative.length)] // TODO: fix potential crash

      colorPrint.error('[UC-REP] - giving negative rep')

      // open reputation box
      await webDriver.findElement(By.id('reputation_' + postID + '-neg')).click()
    }

    setTimeout(async () => {

      if (giveReason) {

        // write a random reputation reason 
        await webDriver.findElement(By.id('reason_' + postID)).sendKeys(message)

        colorPrint.trace('[UC-REP] - giving reputation reason: ' + message)
      } else {

        colorPrint.trace('[UC-REP] - no reputation reason specified')
      }

      // check if the reputation box is opened
      const isRepBoxOpened = await webDriver.findElement(By.xpath('//*[contains(text(), "Reputation")]'))

      // only continue if the reputation box is opened
      if (isRepBoxOpened) {

        // give the post reputation
        await webDriver.findElement(By.id('reputationsubmit_' + postID)).click()
      }
      
      colorPrint.notice('[UC-REP] - finished')

      // exit
      webDriver.quit();

    }, 1000)
  }

  // TODO: repeat the process with another account

})()
