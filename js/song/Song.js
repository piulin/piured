"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode



class Song {

    // TODO: remove keyboard offset.
    constructor(pathToSSCFile, keyBoardOffset) {

        this.keyBoardOffset = keyBoardOffset ;

        this.pathToSSCFile = pathToSSCFile ;

        // Metadata of the song
        this.meta = {} ;

        // NoteData of each level.
        this.levels = [] ;

        // $.get(pathToSSCFile, this.parse.bind(this), 'text');

        // Not that convenient way of reading files from disk.
        readFileContent(pathToSSCFile,this.loadSSC.bind(this)) ;


    }

    getMusicPath() {
        return this.pathToSSCFile.substr(0, this.pathToSSCFile.lastIndexOf("/")) + '/' + this.meta['MUSIC'] ;
    }



    loadSSC(content) {

        // By tag:value
        const sentences = content.split(';');

        // Read header until first NOTEDATA.
        var [songMeta, stopIdx] = parseSSCSection(sentences,0, noteDataSectionCondition, parseValueMeta) ;


        this.meta = songMeta ;

        // Iterate levels (NOTEDATA sections)
        while (stopIdx < sentences.length ) {
            var noteData ;
            // +1: to skip the last NOTEDATA marker
            [noteData, stopIdx] = parseSSCSection(sentences, stopIdx+1, noteDataSectionCondition, parseValueNotes) ;

            this.levels.push(new NoteData(noteData));

        }


    }


    play () {

        this.delay = 1.0 ;
        let audioLoader = new THREE.AudioLoader();
        this.startTime = 0.0 ;

        this.context = new AudioContext();
        //analyser = new THREE.AudioAnalyser( audio, 32 );
        audioLoader.load( this.getMusicPath(), this.playBack.bind(this)


        );

        // this.startTime =  ;
    }

    // This method is called when the buffer with the song is ready.
    playBack( buffer ) {

        let audioBufferSourceNode = this.context.createBufferSource();
        audioBufferSourceNode.buffer = buffer ;
        audioBufferSourceNode.connect(this.context.destination);
        this.startTime = this.context.currentTime;
        audioBufferSourceNode.start(this.startTime + this.delay) ;
        console.log('Start time: ' + this.startTime);

    }



    getCurrentAudioTime( level ) {
        // return this.context.currentTime ;
        // console.log('Outside start time: ' + this.startTime) ;
        // this.levels[level].meta['OFFSET'] ;
        return this.context.currentTime - this.delay + this.levels[level].meta['OFFSET'] - this.keyBoardOffset - this.startTime;
        // return this.startTime - this.audio.context.currentTime + parseFloat(this.meta['OFFSET']);
        //return this.audio.context.currentTime + this.startTime + parseFloat(this.meta['OFFSET']);
    }

    getTotalOffset(level) {
        return - this.delay + this.levels[level].meta['OFFSET'] - this.startTime;
    }




}