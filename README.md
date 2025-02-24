# I18N (Internazionalization)

![Build Status](https://github.com/janis-commerce/i18n/workflows/Build%20Status/badge.svg)
[![npm version](https://badge.fury.io/js/%40janiscommerce%2Fi18n.svg)](https://www.npmjs.com/package/@janiscommerce/i18n)

## Installation
```sh
npm install @janiscommerce/i18n
```

## Language

### Usage

Use this module to get translated messages in the user's preferred language

```js
const { Language } = require('@janiscommerce/i18n');

const language = new Language({
	en: {
		order: {
			errors: {
				notFound: 'Order not found',
				invalidStatus: ({ status }) => `Invalid order status: ${status}`
			}
		}
	},
	es: {
		order: {
			errors: {
				notFound: 'Pedido no encontrado',
				invalidStatus: ({ status }) => `Estado de pedido inválido: ${status}`
			}
		}
	}
});

// Set PREFERRED_USER_LANGUAGE env var to change language

// It accepts 2-code languages, like "es" or "es-AR"
// process.env.PREFERRED_USER_LANGUAGE = 'es';

// It also accepts a raw accept-language header, like "en-US,en;q=0.9,es;q=0.8,pt-BR;q=0.7,pt;q=0.6"
// process.env.PREFERRED_USER_LANGUAGE = 'en-US,en;q=0.9,es;q=0.8,pt-BR;q=0.7,pt;q=0.6';

// Translate messages
console.log(language.translate('order.errors.notFound'));
console.log(language.translate('order.errors.invalidStatus', {
	status: 'pending'
}));

// Throw translated errors
language.throwError('order.errors.notFound');
language.throwError('order.errors.invalidStatus', {
	status: 'pending'
});
// Error: Order not found
//     at ...
//   [cause]: 'order.errors.notFound'
}
```

### Messages definitions and usage

> See a real world example in the [examples](/docs/examples/language/error-messages) folder.

There are two ways to define messages:

#### Simple messages

For simple messages, you can declare them as plain strings. And to use them you just use the messageKey (in dot notation)

#### Complex messages

In case you need a more complex message, with conditions or variable parts, you can define them with a function that returns a string. When you use them, you can pass some parameters as the second argument that will be passed to the function as a parameter.

### Best practices

#### Messages definition

Messages can be defined inline when constructing your language object, but for better readability and easier manteinance, we recommend declaring them in separate files by language and grouping them by prefix.

The following file structure is recommended:

```
├── en
│   └── order
│       └── errors.js
├── es
│   └── order
│       └── errors.js
```

> See a real world example in the [examples](/docs/examples/language/error-messages) folder.
