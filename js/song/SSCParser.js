"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

var commentRegex = new RegExp(/\/\/.*(\n|\r|\r\n|$)/g) ;
var emptyLineRegex = new RegExp(/\s*(\n|\r|\r\n|$)/g);

function parseSSCSection(SSCContentBySentences, startPosition, stopCondition, parseValue) {

    var meta = {} ;


    for (var i = startPosition; i < SSCContentBySentences.length; i++) {
        let sentence = SSCContentBySentences[i];

        let tagValue = sentence.split(':');


        let tag = tagValue[0].replace(commentRegex, '')
            .replace(/\s*#/, '');

        // early stop if stopCondition met, or we reached the end of the file
        if  (stopCondition (tag)) {
            return postProcessing( meta , i ) ;
        } else if (/^(\n|\r|\r\n)$/.exec(tag) != null ) {
            return postProcessing( meta , SSCContentBySentences.length ) ;
        }




        // console.log(tagValue) ;

        if (tag!=='') {
            let value = parseValue(tag, tagValue[1]) ;

            meta[tag] = value ;
        }




    }

    return postProcessing( meta, SSCContentBySentences.length ) ;

}

// This function is called once the stopCondition is met or we arrive to the end of the file.
// In this fuction we postprocess some values of of the metadata.
function postProcessing(meta, endIndex) {

    if ( 'BPMS' in meta ) {
        meta['BPMS'] = parseBPMSValue( meta['BPMS'] ) ;
    }

    return [ meta, endIndex ] ;
}

function parseBPMSValue(BPMSValue) {
    let bpmsList = [] ;
    let bpms = BPMSValue.split(',') ;
    for (var i = 0 ; i < bpms.length ; ++i ) {
        // [0] -> timeStamp
        // [1] -> BPM
        let [ timeStamp, bpm ] = bpms[i].split('=') ;
        bpmsList.push( [parseFloat(timeStamp), parseFloat(bpm)]);
    }
    return bpmsList ;
}

//stop condition for finding notedata sections.
var noteDataSectionCondition = function (tag) {
    return tag === 'NOTEDATA';
} ;

var parseValueMeta = function (tag, value) {
    // console.log(tag);
    return value.replace(commentRegex, '')
        // remove empty lines
        .replace(emptyLineRegex, '')
        // remove # symbol.
        .replace(/\s*#/, '')
        // remove semicolon.
        .replace(/;\s*/, '');
}

var parseValueNotes = function (tag, value) {
    if (tag === 'NOTES') {
        return value.replace(commentRegex, '')
            // remove # symbol.
            .replace(/\s*#/, '')
            // remove semicolon.
            .replace(/;\s*/, '');
    } else {
        return parseValueMeta( tag, value ) ;
    }
}