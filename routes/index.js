import express from 'express';
import { RedditProcessor } from '../utils/RedditProcessor';

const router = express.Router();
const outputFields = ['id', 'title', 'created_utc', 'score'];
const sortableFields = ['created_utc', 'score'];

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', {
      title: 'Reddit data parser',
      sortableFields
  });
});

router.post('/', async (req, res) => {
    const { source, format, operation, direction, field } = req.body;
    const processor = new RedditProcessor(source, format, outputFields);

    res.json(await processor.process(operation, field, direction));
});

export { router };
