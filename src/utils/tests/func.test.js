import { isSeq, head, tail, last } from '../func';


describe('Functional utils', () => {
    describe('isSeq', () => {
        it('should correctly detect a sequence', () => {
            const isSequence = [isSeq('foo'), isSeq('foo'.split())].every(e => e === true);
            const isNotSequence = [isSeq({ message: 'foo' }), isSeq(8), isSeq(true)].every(e => e === false);
            expect(isSequence).toBe(true);
            expect(isNotSequence).toBe(true);
        });
    });

    describe('head', () => {
        it('should return the first element of a sequence', () => {
            expect(head('foo')).toBe('f');
            expect(head('foo'.split(''))).toBe('f');
        });
    });

    describe('tail', () => {
        it('should return the last elements of a sequence', () => {
            expect(tail('foo')).toBe('oo');
            expect(tail('foo'.split(''))).toEqual(['o', 'o']);
        });
    });

    describe('last', () => {
        it('should return the last element of a sequence', () => {
            expect(last('foo')).toBe('o');
            expect(last('foo'.split(''))).toBe('o');
        });
    });
});
