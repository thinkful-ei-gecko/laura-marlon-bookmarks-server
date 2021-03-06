'use strict';

const express = require('express');
const bookmarks = require('./Bookmarks');
const uuid  = require('uuid/v4');
const bookmarkRouter = express.Router();
const bodyParser = express.json();
const logger = require('../logger');

bookmarkRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const {title, url, content} = req.body;

    if (!title) {
      logger.error('Title is required');
      return res
        .status(400)
        .send('Invalid title');
    }
  
    if (!url) {
      logger.error('Title is required');
      return res
        .status(400)
        .send('Invalid url');
    }
    const id = uuid();
  
    const bookmark = {
      id,
      title,
      url,
      content
    };
  
    bookmarks.push(bookmark);
  
    res
      .status(201)
      .location(`http://localhost:8000/list/${id}`)
      .json(bookmark);
  
  });

bookmarkRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find(bookmark => bookmark.id === id);

    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found. `);
      return res
        .status(404)
        .send('Not found');
    }
    
    res.json(bookmark);
    
  })
  .delete((req, res) => {
    const { id } = req.params;
    const bookmarkIndex = bookmarks.findIndex(bookmark => bookmark.id === id);
  
    if (bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found. `);
      return res
        .status(404)
        .send('Not found');
    }
  
    bookmarks.splice(bookmarkIndex, 1);
  
    logger.info(`Bookmark with id ${id} was deleted.`);
    res
      .status(204)
      .end();
  });
  

module.exports = bookmarkRouter;