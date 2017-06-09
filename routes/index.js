import express from 'express';
import { RedditProcessor } from '../utils/RedditProcessor';

const router = express.Router();
const outputFields = ['id', 'title', 'created_utc', 'score'];
const sortableFields = ['created_utc', 'score'];

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', {
      title: 'Reddit data parser',
      outputFields,
      sortableFields
  });
});

router.post('/', async (req, res) => {
    // TODO validate
    const processor = new RedditProcessor({ ...req.body, outputFields });

    res.send(await processor.process());
});

export { router };
