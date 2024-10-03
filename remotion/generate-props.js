import fs from 'fs';
import path from 'path';
import data from '../data.json' with { type: 'json' };
import z from 'zod';

import { Downloader } from 'ytdl-mp3';
import * as p from '@clack/prompts';

p.intro('Generate Video Props');

const group = await p.group(
  {
    sheikh: () =>
      p.select({
        message: 'Who is the sheikh?',
        options: data.map((item) => ({ value: item, label: item.name })),
      }),
    audio: () =>
      p.text({
        message: 'What is the URL of the video?',
        placeholder: 'or use audio.mp3 in ./public folder.',
        validate(url) {
          z.string().url().optional().parse(url);
        },
      }),
  },
  {
    // On Cancel callback that wraps the group
    // So if the user cancels one of the prompts in the group this function will be called
    onCancel: () => {
      p.cancel('Operation cancelled.');
      process.exit(0);
    },
  },
);

const s = p.spinner();
s.start('Downloading audio...');

const audioFile = await downloadAudio(group.audio);
s.stop(`Done! Output file: ${audioFile}`);

generateProps({ ...group.sheikh, audio: path.basename(audioFile) });
p.outro('Props generated successfully! ✨');

/**
 * @param {string | undefined} url
 */
async function downloadAudio(url) {
  const outputDir = path.resolve(process.cwd(), 'public');

  if (!url) return path.join(outputDir, 'audio.mp3');

  const files = fs.readdirSync(outputDir);

  // Remove all mp3 files in the directory
  files.forEach((file) => {
    const filePath = path.join(outputDir, file);

    // Check if the file is an mp3 file and not "audio.mp3"
    if (file.endsWith('.mp3') && file !== 'audio.mp3') {
      fs.unlinkSync(filePath);
    }
  });

  const downloader = new Downloader({ outputDir, silentMode: true });
  const audioFile = await downloader.downloadSong(url);

  return audioFile;
}

/**
 * @param {import('./schema').CompositionProps} payload
 */
function generateProps(payload) {
  const propsFile = path.resolve(process.cwd(), 'input-props.json');
  fs.writeFileSync(propsFile, JSON.stringify(payload), { encoding: 'utf-8' });
}
