# HTML Attribute Templates (HATS)

## Example

```js
import { render } from "@mjstahl/hats";

const template = `
  <html>
    <body>
      <h1 data-show-if="showHeader">HATS<h1>
      First Name:
      <span data-content="firstName" data-content-format="uppercase"></span>
      Last Name:
      <span data-content="lastName" data-content-format="lowercase explode"></span>
    </body>
  </html>
`;

const env = {
  formats: {
    explode: (v) => v.split("").join(" "),
    lowercase: (v) => v.toLowerCase(),
    uppercase: (v) => v.toUpperCase(),
  },
};

render(
  template,
  { firstName: "Mark", lastName: "Stahl", showHeader: false },
  env,
);

// <html>
//   <body>
//     First Name:
//     <span data-content="firstName" data-content-format="uppercase">MARK</span>
//     Last Name:
//     <span data-content="lastName" data-content-format="lowercase explode">s t a h l</span>
//   </body>
// </html>
```
