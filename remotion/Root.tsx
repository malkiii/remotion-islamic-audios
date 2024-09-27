import { Composition, staticFile } from 'remotion';
import { getAudioData } from '@remotion/media-utils';
import { VideoComposition } from './composition';
import { compositionSchema } from './schema';

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="islamic-video"
      component={VideoComposition}
      fps={FPS}
      width={1080}
      height={1920}
      durationInFrames={FPS * 5}
      schema={compositionSchema}
      defaultProps={{
        name: 'Sheikh Name in Arabic',
        image: 'sheikh.jpg',
        audio: 'audio.mp3',
      }}
      calculateMetadata={async ({ props }) => {
        const data = await getAudioData(staticFile(props.audio));
        return { durationInFrames: Math.floor(data.durationInSeconds * FPS) };
      }}
    />
  );
};
