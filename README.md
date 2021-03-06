# uc-rep-bot [![Codacy Badge](https://app.codacy.com/project/badge/Grade/597283f938aa4f74b83f8b7dbf4e6146)](https://www.codacy.com/gh/otvv/uc-rep-bot/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=otvv/uc-rep-bot&amp;utm_campaign=Badge_Grade)

A simple reputation bot for [UnKnoWnCheaTs](https://www.unknowncheats.me).

***

<details>
<summary>features:</summary>

-   positive/negative rep
-   give rep without text _(reputation reason)_
-   support for multiple accounts _(check src/config/accounts.json)_
-   random reputation reason according to rep type _(positive/negative)_
-   ability to add new reputation reason _(messages)_

**todo:**

-   cloudflare checks
-   wrong username/password check
-   ~better account picker _(it will rule out used accounts)_~ :heavy_check_mark:
-   discord integration 

:construction: _more to come.._

</details>

<h4>installing:</h4>

Since this is a Node application, you will need to install `node` on your computer.

<h4>usage:</h4>

Inside the _"src"_ folder, open up a _Terminal, Command Prompt or PowerShell_ window and type: `node ./index.js post_id rep_type`

_NOTE_: The third argument will always be `true`, unless you set it to `false`.

<h5>example:</h5>

```js
node ./index.js 2568666 positive // this will give a positive rep and it will pick a random positive message from message.json file
node ./index.js 2568666 positive false // this will give a positive rep without a reputation reason (message)
node ./index.js 2568666 negative // this will give a negative rep and it will pick a random negative message from message.json file
node ./index.js 2568666 negative false // this will give a negative rep without a reputation reason (message)
```

## DISCLAIMER
This could get your account banned. Use this at your own risk.

***

**uc-rep-bot** is available under the [MIT License](https://github.com/otvv/uc-rep-bot/blob/master/LICENSE)
