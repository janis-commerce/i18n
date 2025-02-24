'use strict';

const { default: acceptLanguage } = require('accept-language');

const DEFAULT_LANGUAGE = 'en';

/**
 * @callback MessageBuilderFunction
 * @param {Record<string, any>} messageParameters
 * @returns {string}
 */

/**
 * @typedef {string | MessageBuilderFunction} MessageBuilder
 */

/**
 * @typedef {Record<string, MessageBuilder | Record<string, MessageBuilder>>} MessageContainer
 */

module.exports = class Language {

	/**
	 * @param {Record<string, MessageContainer>} messagesByLanguage
	 */
	constructor(messagesByLanguage) {
		/** @private */
		this.messagesByLanguage = messagesByLanguage;
		acceptLanguage.languages(Object.keys(messagesByLanguage));
	}

	/**
	 * @private
	 */
	getLanguage() {
		return acceptLanguage.get(process.env.PREFERRED_USER_LANGUAGE || DEFAULT_LANGUAGE);
	}

	/**
	 * @private
	 * @param {string} language
	 * @param {string} messageKey
	 * @param {Record<string, any>} messageParameters
	 * @returns {string} The translated message or the messageKey if not found
	 */
	getMessage(language, messageKey, messageParameters) {

		const languageMessages = this.messagesByLanguage[language];

		const messageBuilder = messageKey.split('.').reduce((messageObject, keyPart) => {
			return messageObject?.[keyPart];
		}, languageMessages);

		if(!messageBuilder)
			return messageKey;

		if(typeof messageBuilder === 'function')
			return messageBuilder(messageParameters);

		return messageBuilder;
	}

	/**
	 * Translates a message key
	 *
	 * @param {string} messageKey
	 * @param {Record<string, any>} messageParameters
	 * @returns {string} The translated message or the messageKey if not found
	 */
	translate(messageKey, messageParameters) {

		const language = this.getLanguage();

		const message = this.getMessage(language, messageKey, messageParameters);

		return message;
	}

	/**
	 * Throws an error with a translated message. The error includes a `cause` property with the messageKey
	 *
	 * @param {string} messageKey
	 * @param {Record<string, any>} messageParameters
	 * @throws {Error} An error with the translated message
	 */
	throwError(messageKey, messageParameters) {

		const errorMessage = this.translate(messageKey, messageParameters);

		throw new Error(errorMessage, {
			cause: messageKey
		});
	}

};
