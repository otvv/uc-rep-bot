// unknowncheats.me reputation bot
//
// by: otvv and danielsrbastos
// license: MIT

// modules
const Random = require("random");
const colorPrint = require("colorprint");
const Firefox = require("selenium-webdriver/firefox");
const { Builder, By, Key, until } = require("selenium-webdriver");

// external configs
const accountsJSON = require("./config/accounts.json");
const messagesJSON = require("./config/messages.json");

(async function main() {

  // handle environment variables
  const repArguments = process.argv.splice(2);

  // post id (first variable)
  const postID = repArguments[0];

  if (!postID) {

    colorPrint.warn("[UC-REP] - you need to add a post id first");
    return;
  }

  // reputation type
  const repType = repArguments[1];

  if (!repType) {

    colorPrint.warn("[UC-REP] - please type in the reputation type (positive/negative)");
    return;
  }

  // this will keep the code running until we run out of accounts
  for (let i = 0; i < accountsJSON.Username.length; i++) {

    const webDriver = new Builder()
      .forBrowser("firefox")
      .setFirefoxOptions(new Firefox.Options().setPreference("browser.privatebrowsing.autostart", true).headless())
      .build();

    // give custom reputation reason
    const giveReason = repArguments[2] === false ? false : true;

    colorPrint.trace("[UC-REP] - opening main page");

    // open main unknowncheats page
    await webDriver.get("https://www.unknowncheats.me/forum/index.php");

    // check if the main page is loaded
    const isMainPageLoaded = await webDriver.wait(until.urlIs("https://www.unknowncheats.me/forum/index.php"));

    if (isMainPageLoaded) {

      colorPrint.trace("[UC-REP] - main page opened");

      // store account username & password here
      let username, password = "";

      username = accountsJSON.Username[i];
      password = accountsJSON.Password[i];

      // username
      await webDriver.findElement(By.id("navbar_username")).sendKeys(username);

      // password
      await webDriver.findElement(By.id("Password1")).sendKeys(password, Key.RETURN);

      colorPrint.trace("[UC-REP] - attempting to log in");

      // check if the account has sucessfully logged in
      const loggedIn = await webDriver.wait(until.urlIs("https://www.unknowncheats.me/forum/login.php"));

      if (loggedIn) {

        colorPrint.trace(`[UC-REP] - account logged in (${username})`);

        // open post to give reputation
        await webDriver.get("https://www.unknowncheats.me/forum/" + postID + "-post.html");

        // wait for it to load all elements
        const foundPost = await webDriver.wait(until.urlIs("https://www.unknowncheats.me/forum/" + postID + "-post.html"));

        // if the post id is invalid
        if (!foundPost) {

          // check if the post id is valid
          await webDriver.findElement(By.xpath("//*[contains(text(), 'Invalid Post specified')]"));

          colorPrint.fatal("[UC-REP] - unknown post id");

          // exit
          webDriver.quit();
          break;
        }

        colorPrint.trace("[UC-REP] - found post id: " + postID);

        // store random reputation messages here
        let message = "";

        // check which type of rep we"re going to add
        if (repType === "positive") {

          message = messagesJSON.Positive[Random.int(0, messagesJSON.Positive.length)]; // FIXME: potential crash

          colorPrint.info("[UC-REP] - giving positive rep");

          // open reputation box
          await webDriver.findElement(By.id("reputation_" + postID + "-pos")).click();
        } else if (repType === "negative") {

          message = messagesJSON.Negative[Random.int(0, messagesJSON.Negative.length)]; // FIXME: potential crash

          colorPrint.error("[UC-REP] - giving negative rep");

          // open reputation box
          await webDriver.findElement(By.id("reputation_" + postID + "-neg")).click();
        }

        // wait until the reputation box is opened
        for (; ;) {

          const isDisplayed = await (await webDriver.findElement(By.id("reason_" + postID))).isDisplayed();

          if (isDisplayed) {

            // stop loop if the reputation box is open
            break;
          }
        }

        if (giveReason) {

          // write a random reputation reason 
          await webDriver.findElement(By.id("reason_" + postID)).sendKeys(message);

          colorPrint.trace("[UC-REP] - giving reputation reason: " + message);
        } else {

          colorPrint.warn("[UC-REP] - no reputation reason specified");
        }

        // give rep
        await webDriver.executeScript("arguments[0].click();", webDriver.findElement(By.id("reputationsubmit_" + postID)));

        colorPrint.info("[UC-REP] - finished");

        // exit
        webDriver.quit();
      }
    }
  }
})();
