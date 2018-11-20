'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = false;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    const events = new Map();

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (!events.has(event)) {
                const eventsEntry = [context, [handler]];

                events.set(event, new Map([eventsEntry]));

                return this;
            }

            const eventsEntry = events.get(event);

            if (!eventsEntry.has(context)) {
                eventsEntry.set(context, [handler]);

                return this;
            }

            events
                .get(event)
                .get(context)
                .push(handler);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            events.forEach((value, key) => {
                if (key.startsWith(event + '.') || key === event) {
                    value.delete(context);
                }
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            function allEvents(e) {
                const eventParts = e.split('.');

                const newEnents = [];
                for (let i = 0; i < eventParts.length; i++) {
                    const part = eventParts[i];

                    const prevEvent = newEnents[i - 1];

                    const curEvent = [prevEvent, part].join('.');

                    newEnents.push((newEnents.length === 0)
                        ? part : curEvent);
                }

                return newEnents.reverse();
            }

            const newEvents = allEvents(event)
                .filter(emitEvent => events.has(emitEvent));

            newEvents.forEach(function (emitEvent) {
                events.get(emitEvent).forEach(function (handlers, context) {
                    handlers.forEach(handler => handler.call(context));
                });
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
