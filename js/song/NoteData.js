"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode


class NoteData {

    constructor( noteDataSSCContent ) {

        let notesSSC = noteDataSSCContent['NOTES'] ;

        // metadata of the notedata section
        this.meta = noteDataSSCContent ;

        
        delete this.meta['NOTES'] ;
        // aka bars in music terminology
        // shape: bars x notesperbar x note
        this.measures = notesSSC.split(',') ;

        for ( var i = 0 ; i < this.measures.length ; i++ ) {

            this.measures[i] = this.measures[i].split('\n') ;
            //remove first and last element
            this.measures[i].pop();
            this.measures[i].shift();

        }

    }

}

