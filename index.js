const express = require('express');
const app = express();
app.use(express.json());

// Initialize the game structure
let game = {
  levels: Array.from({ length: 5 }, (_, levelIndex) => ({
    id: levelIndex + 1,
    stages: Array.from({ length: 5 }, (_, stageIndex) => ({
      id: stageIndex + 1,
      codeLines: Array(4).fill("") // 4 empty code lines
    }))
  }))
};

// Get all levels
app.get('/levels', (req, res) => {
  res.json(game.levels);
});

// Get all stages for a specific level
app.get('/levels/:levelId/stages', (req, res) => {
  const levelId = parseInt(req.params.levelId);
  const level = game.levels.find(l => l.id === levelId);
  if (!level) return res.status(404).json({ error: 'Level not found' });
  res.json(level.stages);
});

// Get code lines for a specific stage
app.get('/levels/:levelId/stages/:stageId', (req, res) => {
  const levelId = parseInt(req.params.levelId);
  const stageId = parseInt(req.params.stageId);
  const level = game.levels.find(l => l.id === levelId);
  if (!level) return res.status(404).json({ error: 'Level not found' });
  const stage = level.stages.find(s => s.id === stageId);
  if (!stage) return res.status(404).json({ error: 'Stage not found' });
  res.json(stage.codeLines);
});

// Add or update code lines for a stage
app.post('/levels/:levelId/stages/:stageId', (req, res) => {
  const levelId = parseInt(req.params.levelId);
  const stageId = parseInt(req.params.stageId);
  const { codeLines } = req.body;

  const level = game.levels.find(l => l.id === levelId);
  if (!level) return res.status(404).json({ error: 'Level not found' });
  const stage = level.stages.find(s => s.id === stageId);
  if (!stage) return res.status(404).json({ error: 'Stage not found' });

  if (!Array.isArray(codeLines) || codeLines.length !== 4) {
    return res.status(400).json({ error: 'Invalid code lines' });
  }

  stage.codeLines = codeLines;
  res.json({ message: 'Code lines updated successfully', stage });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});