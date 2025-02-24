'use strict';

const assert = require('assert');

const {
	Language
} = require('../lib');

describe('Language', () => {

	const sampleErrorMessagesByLanguage = {
		en: {
			order: {
				notFound: 'Order not found',
				invalidStatus: ({ status }) => `Invalid order status: ${status}`
			}
		},
		es: {
			order: {
				notFound: 'Pedido no encontrado',
				invalidStatus: ({ status }) => `Estado de pedido inválido: ${status}`
			}
		}
	};

	let envBackup;

	beforeEach(() => {
		envBackup = {
			...process.env
		};
	});

	afterEach(() => {
		process.env = envBackup;
	});

	describe('translate()', () => {

		it('Should return the translated message in the default language if no preferred language is set (string message)', async () => {

			const language = new Language(sampleErrorMessagesByLanguage);

			const message = language.translate('order.notFound');

			assert.strictEqual(message, 'Order not found');
		});

		it('Should return the translated message in the default language if no preferred language is set (function message)', async () => {

			const language = new Language(sampleErrorMessagesByLanguage);

			const message = language.translate('order.invalidStatus', {
				status: 'pending'
			});

			assert.strictEqual(message, 'Invalid order status: pending');
		});

		it('Should return the messageKey for missing error messages when no preferred language is set', async () => {

			const language = new Language(sampleErrorMessagesByLanguage);

			const message = language.translate('order.unknownMessage');

			assert.strictEqual(message, 'order.unknownMessage');
		});

		it('Should return the translated message in the preferred language if set', async () => {

			process.env.PREFERRED_USER_LANGUAGE = 'es';

			const language = new Language(sampleErrorMessagesByLanguage);

			const message = language.translate('order.notFound');

			assert.strictEqual(message, 'Pedido no encontrado');
		});

		it('Should be able to handle preferred language with language and region', async () => {

			process.env.PREFERRED_USER_LANGUAGE = 'es-AR';

			const language = new Language(sampleErrorMessagesByLanguage);

			const message = language.translate('order.notFound');

			assert.strictEqual(message, 'Pedido no encontrado');
		});

		it('Should return the messageKey for missing error messages when preferred language is set', async () => {

			process.env.PREFERRED_USER_LANGUAGE = 'es';

			const language = new Language(sampleErrorMessagesByLanguage);

			const message = language.translate('order.unknownMessage');

			assert.strictEqual(message, 'order.unknownMessage');
		});

	});

	describe('throwError()', () => {

		it('Should throw an error with the translated message in the default language if no preferred language is set', async () => {

			const language = new Language(sampleErrorMessagesByLanguage);

			assert.throws(() => language.throwError('order.notFound'), error => {

				assert.strictEqual(error.name, 'Error');
				assert.strictEqual(error.message, 'Order not found');
				assert.strictEqual(error.cause, 'order.notFound');

				return true;
			});

		});

		it('Should throw an error with the translated message in the preferred language if it is set', async () => {

			process.env.PREFERRED_USER_LANGUAGE = 'es';

			const language = new Language(sampleErrorMessagesByLanguage);

			assert.throws(() => language.throwError('order.notFound'), error => {

				assert.strictEqual(error.name, 'Error');
				assert.strictEqual(error.message, 'Pedido no encontrado');
				assert.strictEqual(error.cause, 'order.notFound');

				return true;
			});

		});
	});

});
