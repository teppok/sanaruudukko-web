

  Sanaruudukko - Word grid
  Copyright 2012-2013 Teppo Kankaanpää
  
  Guide for Web frontend
  
  1. Backend
  
    This frontend of the program depends on the COBOL backend to perform program logic
  and database interaction. This backend is the project teppok/sanaruudukko-cobol.
  index.html and the various javascript files assume that the cgi programs processq and
  submitchat are accessible as /cgi-bin/processq.cgi and /cgi-bin/submitchat.cgi on
  the same server where this frontend is installed.
  
  2. Short introduction
  
    The program has 3 views: Login view, Room select view and Room view. Room select view
  and room view are in index.html as hidden divs initially, and they are shown during
  the program run.
  
    roomlist.js handles Login view and Room select view processing. Chat.js handles
  the chat dialog, and allwords.js handles the feature to show all possible words that
  fit in the grid. main.js handles everything else, showing submitted words, submitting
  words, showing time and showing the board.
  
    Most of the ajax queries are instantaneous, but there is a long-poll query
  wordwaiter (processq.cgi?func=wordwaiter) that will exit in 15 seconds unless there is
  something to show, in which case it exits earlier and returns this info, be it info
  on a new round or new words someone has submitted.
  
   