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

  // handle environment variables
  const repArguments = process.argv.splice(2)

  // post id (first variable)
  const postID = repArguments[0]

  if (!postID) {

    colorPrint.warn('[UC-REP] - you need to add a post id first')
    return
  }

  // reputation type
  const repType = repArguments[1]

  if (!repType) {

    colorPrint.warn('[UC-REP] - please type in the reputation type (positive/negative)')
    return
  }

  // this will keep the code running until we ran out of accounts
  while (true) {

    const webDriver = new Builder()
      .forBrowser('firefox')
      .setFirefoxOptions(new Firefox.Options().setPreference('browser.privatebrowsing.autostart', true).headless())
      .build()

    // give custom reputation reason (second variable)
    const giveReason = repArguments[2] == true ? true : false

    colorPrint.trace('[UC-REP] - opening main page')

    // open main unknowncheats page
    await webDriver.get('https://www.unknowncheats.me/forum/index.php')

    // check if the main poge is loaded
    const isMainPageLoaded = await webDriver.wait(until.urlIs('https://www.unknowncheats.me/forum/index.php'))

    if (isMainPageLoaded) {

      colorPrint.trace('[UC-REP] - main page opened')

      // store account username & password here
      let { username, password } = ''
      
      username = accountsJSON.Username[Random.int(0, accountsJSON.Username.length)] // FIXME: potential crash
      password = accountsJSON.Password[Random.int(0, accountsJSON.Password.length)] // FIXME: potential crash

      // TODO: this check is kinda useless right now. The goal here is to make some sort of container to store the accounts and then 
      // somehow, delete them from the container once they're used. After that check if the container is empty and stop the bot from running
      if (!username || !password) {

        colorPrint.error('[UC-REP] - ran out of accounts')

        // exit
        webDriver.quit();
        break;
      }

      // username
      await webDriver.findElement(By.id('navbar_username')).sendKeys(username)

      // password
      await webDriver.findElement(By.id('Password1')).sendKeys(password, Key.RETURN)

      colorPrint.trace('[UC-REP] - attempting to log in')
      
      // check if the account has sucessfully logged in
      const loggedIn = await webDriver.wait(until.urlIs('https://www.unknowncheats.me/forum/login.php'))

      if (loggedIn) {

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
          break;

        } catch (e) { }

        colorPrint.trace('[UC-REP] - found post id: ' + postID)

        // store random reputation messages
        let message = ''

        // check which type of rep we're going to add
        if (repType === 'positive') {

          message = messagesJSON.Positive[Random.int(0, messagesJSON.Positive.length)] // FIXME: potential crash

          colorPrint.info('[UC-REP] - giving positive rep')

          // open reputation box
          await webDriver.findElement(By.id('reputation_' + postID + '-pos')).click()
        } else if (repType === 'negative') {

          message = messagesJSON.Negative[Random.int(0, messagesJSON.Negative.length)] // FIXME: potential crash

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

            colorPrint.warn('[UC-REP] - no reputation reason specified')
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
    }
  }
})()
