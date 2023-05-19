# :robot: `uc-rep-bot`

A simple reputation bot for [UnKnoWnCheaTs](https://www.unknowncheats.me).

***

<details>
<summary>features:</summary>

-   positive/negative rep
-   give rep without text _(reputation reason)_
-   support for multiple accounts _(check src/config/accounts.json)_
-   random reputation reason according to rep type _(positive/negative)_
-   ability to add new reputation reasons _(messages)_

**todo:**

-   cloudflare checks
-   wrong username/password check
-   being able to select a specific type of rep reason to give _(lets say that you want to give a negative rep to someone but want to use a positive rep reason message)_
-   ~better account picker _(it will rule out accounts that were already used to give rep on the specified post)_~ :heavy_check_mark:
-   discord integration (my plan for this is to eventually transform this into a discord bot)_

:construction: _more to come.._

</details>

<h4>installing:</h4>

Since this is a Node application, you will need to install `node` on your computer alongside `npm`.

Inside the repo _"root"_ (master) folder, open a _Terminal, Command Prompt or PowerShell_ window and type: `npm install` or `npm i` (both will do the same thing)

The above command will install the necessary dependencies for the bot to work.

<h4>usage:</h4>

Now navigate to the _"src"_ folder and open a _Terminal, Command Prompt or PowerShell_ window there. Then type: `node ./index.js post_id (post number) rep_type (positive/negative) give_rep_reason (true/false)`

_NOTE_: The third argument will always be `true`, unless you set it to `false`.

<h5>example:</h5>

```js
node ./index.js 2568666 positive // this will give a positive rep and it will pick a random positive message from message.json file
node ./index.js 2568666 positive false // this will give a positive rep without a reputation reason (message)
node ./index.js 2568666 negative // this will give a negative rep and it will pick a random negative message from message.json file
node ./index.js 2568666 negative false // this will give a negative rep without a reputation reason (message)
```

## DISCLAIMER
This bot is not meant for mass usage. So be careful, this could get your account(s) banned.

**Use this at your own risk.**

## CONTRIBUTORS
Big thanks to [@danielsrbastos](https://github.com/danielsrbastos) who helped me write this code way back in 2019 and test it as well.

***

**uc-rep-bot** is available under the [MIT License](https://github.com/otvv/uc-rep-bot/blob/master/LICENSE)
