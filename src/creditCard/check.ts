/**
 * Generate fake and valid numbers
 *
 * @see https://fakenumbers.io
 * @license https://fakenumbers.io/license
 * @copyright 2020 Nguyen Huu Phuoc <me@phuoc.ng>
 */

import CheckResult from '../CheckResult';
import { CreditCardMap, CreditCardType } from './CreditCardType';
import luhn, { DoublePosition } from '../utils/luhn';

const check = (input: string): CheckResult<CreditCardType[]> => {
    if (!/^\d+$/.test(input)) {
        return { valid: false, meta: [] };
    }

    const converted = input.split('').map((c) => parseInt(c, 10));
    const checkDigit = converted.pop();

    const isValid = luhn(converted.reverse(), DoublePosition.Even) === checkDigit;
    if (!isValid) {
        return { valid: false, meta: [] };
    }

    const match = [];
    for (const tpe of Object.keys(CreditCardType)) {
        const cardType: CreditCardType = CreditCardType[tpe];
        if (!CreditCardMap.has(cardType)) {
            continue;
        }

        const cardFormat = CreditCardMap.get(cardType);
        const { prefix, length } = cardFormat;
        for (const i in cardFormat.prefix) {
            // Check the prefix and length
            if (input.substr(0, prefix[i].length) === prefix[i] && length.indexOf(input.length) !== -1) {
                match.push(cardType);
            }
        }
    }

    return { valid: true, meta: match };
};

export default check;
