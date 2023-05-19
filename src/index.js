// unknowncheats.me reputation bot
//
// by: otvv and danielsrbastos
// license: MIT

// modules
import Random from 'random';
import colorprint from 'colorprint';
import Firefox from 'selenium-webdriver/firefox.js';
import { Browser, Builder, By, Key, until } from 'selenium-webdriver';

// external configs
import accounts from './config/accounts.json' assert { type: 'json' }; // FIXME: fix this later
import messages from './config/messages.json' assert { type: 'json' }; // FIXME: fix this later

(() => {
  // handle environment variables
  const repArguments = process.argv.splice(2);

  // post id (first arg)
  const postID = repArguments[0];

  if (!postID) {
    return colorprint.warn("[UC-REP] - you need to add a post id first");
  }

  // reputation type (second arg)
  const repType = repArguments[1];

  if (!repType) {
    return colorprint.warn("[UC-REP] - please type in the reputation type (positive/negative)");
  }

  accounts.username.forEach(async (user, i) => {
    // create a new window for each new attempt until we run out of accounts
    const webDriver = await new Builder()
      .forBrowser(Browser.FIREFOX)
      .setFirefoxOptions(new Firefox.Options().setPreference("browser.privatebrowsing.autostart", true))
      .build();

    // give custom reputation reason
    const giveReason = repArguments[2] === false ? false : true;

    // open main unknowncheats page
    colorprint.trace("[UC-REP] - opening main page");
    await webDriver.get("https://www.unknowncheats.me/forum/index.php");

    // check if the main page is loaded
    const isMainPageLoaded = await webDriver.wait(until.urlIs("https://www.unknowncheats.me/forum/index.php"));

    if (isMainPageLoaded) {
      colorprint.trace("[UC-REP] - main page opened");

      // use these to store the current account username and password
      let username = user;
      let password = accounts.password[i];

      colorprint.trace("[UC-REP] - attempting to log in");

      // attempt to log-in with passed username & password
      await webDriver.findElement(By.id("navbar_username")).sendKeys(username);
      await webDriver.findElement(By.id("Password1")).sendKeys(password, Key.RETURN); // "press" ENTER after typing the password

      // check if the account has sucessfully logged in
      const loggedIn = await webDriver.wait(until.urlIs("https://www.unknowncheats.me/forum/login.php"));

      if (loggedIn) {
        colorprint.trace(`[UC-REP] - account logged in: ${username}`);

        // open post to give reputation
        await webDriver.get(`https://www.unknowncheats.me/forum/${postID}-post.html`);

        // wait for the post page to load
        const foundPost = await webDriver.wait(until.urlIs(`https://www.unknowncheats.me/forum/${postID}-post.html`));

        // if the post id is invalid
        if (!foundPost) {
          // check if the post id is valid
          await webDriver.findElement({xpath: "//*[contains(text(), 'Invalid Post specified')]"});
          
          // exit
          await webDriver.quit();
          throw colorprint.fatal("[UC-REP] - unknown post id");
        }

        colorprint.info("[UC-REP] - found post id:", postID);

        // store random reputation messages here
        let message = "";

        // check which type of rep we"re going to add
        if (repType === "positive") {
          // if the message array is empty, it will give a positive rep without a reason (message)
          if (giveReason && messages.positive.length > 0) {
            message = messages.positive[Random.int(0, messages.positive.length)];
          }
          
          const repMenuFound = await webDriver.findElement({id: `reputationmenu_${postID}`});
          
          if (repMenuFound) {
            colorprint.info("[UC-REP] - giving positive rep");

            // open reputation box
            await webDriver.findElement({id: `reputation_${postID}-pos`}).click();
          }
        } else if (repType === "negative") {
          // if the message array is empty, it will give a negative rep without a reason (message)
          if (giveReason && message.negative.length > 0) {
            message = messages.negative[Random.int(0, messages.negative.length)];
          }

          const repMenuFound = await webDriver.findElement({id: `reputationmenu_${postID}`});

          
          if (repMenuFound) {
            colorprint.error("[UC-REP] - giving negative rep");
            
            // open reputation box
            await webDriver.findElement({id: `reputation_${postID}-neg`}).click();
          }
        }

        // wait until the reputation box is opened
        const isDisplayed = await webDriver.findElement({id: `reason_${postID}`}).isDisplayed();

        if (isDisplayed) {
          if (giveReason) {
            colorprint.trace("[UC-REP] - giving reputation reason:", message);

            // write a random reputation reason 
            await webDriver.findElement({id: `reason_${postID}`}).sendKeys(message);
          } else {
            colorprint.warn("[UC-REP] - no reputation reason specified, continuing");
          }

          // give rep
          await webDriver.executeScript("arguments[0].click();", webDriver.findElement({id: `reputationsubmit_${postID}`}));
        }
        
        // clean up and exit
        username = ''
        password = ''
        message = ''
        await webDriver.quit();

        colorprint.info("[UC-REP] - finished cycle");
      }
    }

    colorprint.info(`[UC-REP] - account ${i} from ${accounts.username.length}`);
  })
})();
