const mon = require('mongodb');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Mongo = require('../utils/db');
const Redis = require('../utils/redis');

class FilesController {
  static async addFile(req, res) {
    const id = await Redis.get(`auth_${req.headers['x-token']}`);
    if (!id) return res.status(401).json({ error: 'Unauthorized' });
    // pull data from the request, 2 values have defaults if not present
    const {
      name,
      type,
      data,
      isPublic = false,
      parentId = 0,
    } = req.body;
    // confirm the values are present in the request
    if (!name) return res.status(400).json({ error: 'Missing name' });
    if (!type) return res.status(400).json({ error: 'Missing type' });
    if (!data && type !== 'folder') {
      return res.status(400).json({ error: 'Missing data' });
    }
    // parentId is expected to return an object of type: folder
    if (parentId) {
      const file = await Mongo.files.findOne({ _id: new mon.ObjectID(parentId) });
      if (!file) return res.status(400).json({ error: 'Parent not found' });
      if (file.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }
    let addedFile;
    const userId = mon.ObjectId(id);
    // if type == folder, add folder else process file
    if (type === 'folder') {
      addedFile = await Mongo.files.insertOne({
        userId,
        name,
        type,
        isPublic,
        parentId,
      });
    } else {
      const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';
      // confirm FOLDER_PATH exists, if not create it
      if (!fs.existsSync(FOLDER_PATH)) {
        fs.mkdirSync(FOLDER_PATH);
      }
      // create uuid v4 value for the filepath of the document
      const filePath = `${FOLDER_PATH}/${uuidv4()}`;
      // may need utf-8 encoding
      const decode = Buffer.from(data, 'base64').toString();
      // store the file locally
      await fs.promises.writeFile(filePath, decode);
      // insert new file info into mongodb
      addedFile = await Mongo.files.insertOne({
        userId,
        name,
        type,
        isPublic,
        parentId,
        filePath,
      });
    }
    return res.status(201).json({
      id: addedFile.insertedId,
      userId,
      name,
      type,
      isPublic,
      parentId,
    });
  }

  static async getFile(req, res) {
    // confirm the user is authorized, "connected"
    const userId = await Redis.get(`auth_${req.headers['x-token']}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    // grab the file matching the id provided
    const fileId = new mon.ObjectId(req.params.id);
    const file = await Mongo.files.findOne({ _id: fileId });
    // confirm the file is present and tied to the user
    // eslint-disable-next-line
    if (!file || userId != file.userId) {
      return res.status(404).json({ error: 'Not found' });
    }
    // return the file info
    return res.json({ ...file });
  }

  static async getFiles(req, res) {
    // confirm the user is authorized, "connected"
    const userId = await Redis.get(`auth_${req.headers['x-token']}`);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    // grab values from query params, defaults are 0
    const { parentId = 0, page = 0 } = req.query;
    let fileList;
    if (parentId) {
      fileList = await Mongo.files.aggregate([
        { $match: { parentId: new mon.ObjectID(parentId) } },
        { $skip: page * 20 },
        { $limit: 20 },
      ]).toArray();
    } else {
      fileList = await Mongo.files.aggregate([
        { $match: { userId: new mon.ObjectID(userId) } },
        { $skip: page * 20 },
        { $limit: 20 },
      ]).toArray();
    }
    return res.json(fileList);
  }
}

module.exports = FilesController;
