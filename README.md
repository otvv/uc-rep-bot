# uc-rep-bot [![Codacy Badge](https://app.codacy.com/project/badge/Grade/1c5f2914a0464a8690abf686c998d053)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=otvv/uc-rep-bot&amp;utm_campaign=Badge_Grade)
A simple reputation bot for UnKnoWnCheaTs.me

## DISCLAIMER
This could get your account banned. Use this at your own risk.

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
-   better account picker (it will rule out used accounts)
-   discord integration

:construction: _more to come.._

</details>

<h4>installing:</h4>

Since this is a Node application, you'll need `node`.

<h4>usage:</h4>

The usage is pretty straight-forward.

Here's how:

... on the _"uc-rep-bot"_ root folder, type: `node src/index.js post_id rep_type`

_NOTE_: The third argument will be defaulted to true.

<h5>example:</h5>

```cpp
node src/index.js 2568666 positive // this will give a positive rep and it will pick a random positive message from message.json file

node src/index.js 2568666 positive false // this will give a positive rep without a reputation reason (message)

node src/index.js 2568666 negative // this will give a negative rep and it will pick a random negative message from message.json file

node src/index.js 2568666 negative false // this will give a negative rep without a reputation reason (message)
```
***

**uc-rep-bot** is available under the [MIT License](https://github.com/otvv/uc-rep-bot/blob/master/LICENSE)
