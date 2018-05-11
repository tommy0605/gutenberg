/**
 * Internal dependencies
 */
import { getIndentedContent } from '../';

describe( 'getIndentedContent()', () => {
	it( 'should not indent empty string', () => {
		const result = getIndentedContent( '' );

		expect( result ).toBe( '' );
	} );

	it( 'should indent by newline', () => {
		const result = getIndentedContent( 'Foo\nBar' );

		expect( result ).toBe( '\tFoo\n\tBar' );
	} );

	it( 'should not indent blank lines', () => {
		const result = getIndentedContent( 'Foo\n\nBar' );

		expect( result ).toBe( '\tFoo\n\n\tBar' );
	} );
} );
