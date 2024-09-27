import {
  AbsoluteFill,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Img,
  Audio,
  interpolate,
} from 'remotion';
import { loadFont } from '@remotion/fonts';
import { useAudioData, visualizeAudio } from '@remotion/media-utils';
import type { CompositionProps } from './schema';

const fontFamily = 'Local';

loadFont({
  family: fontFamily,
  url: staticFile('fonts/Diwani-Bent.ttf'),
});

export const VideoComposition: React.FC<CompositionProps> = (props) => {
  // A <AbsoluteFill> is just a absolutely positioned <div>!
  return (
    <AbsoluteFill style={{ padding: 0, margin: 0 }}>
      <Img
        src={staticFile(props.image)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          filter: 'saturate(50%) contrast(1.2)',
          border: 'none',
          outline: 'none',
          objectFit: 'cover',
        }}
      />
      <AbsoluteFill
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(20px)',
          color: 'white',
        }}
      >
        <AbsoluteFill
          style={{
            position: 'absolute',
            width: '100%',
            height: 'fit-content',
            left: '0',
            top: '50%',
            mixBlendMode: 'screen',
            transform: 'translateY(-50%)',
            textAlign: 'center',
          }}
        >
          <Img
            src={staticFile(props.image)}
            style={{
              width: '33%',
              aspectRatio: '1/1',
              borderRadius: '50%',
              display: 'block',
              margin: '0 auto',
              filter: 'contrast(1.2) brightness(0.9) saturate(90%)',
            }}
          />
          <div
            style={{
              display: 'block',
              fontFamily,
              fontSize: '6.5rem',
              whiteSpace: 'nowrap',
              marginBottom: '13rem',
            }}
          >
            {props.name}
          </div>
          <AudioVisualizer />
        </AbsoluteFill>
      </AbsoluteFill>
      <Audio src={staticFile(props.audio)} volume={(f) => interpolate(f, [0, 25], [0, 1])} />
    </AbsoluteFill>
  );
};

const AudioVisualizer: React.FC = () => {
  const frame = useCurrentFrame();
  const config = useVideoConfig();

  const props = config.props as CompositionProps;
  const audioData = useAudioData(staticFile(props.audio));

  if (!audioData) return null;

  const numberOfSamples = 64;

  const visualization = visualizeAudio({
    frame,
    fps: config.fps,
    numberOfSamples,
    audioData,
  });

  const leftBars = 45;
  const rightBars = numberOfSamples - leftBars;

  // Render a bar chart for each frequency, the higher the amplitude,
  // the longer the bar
  return (
    <AbsoluteFill
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        gap: '1rem',
        margin: '0 auto',
      }}
    >
      {visualization
        .reverse()
        .slice(leftBars)
        .map((v) => (
          <VisualizerBar height={v} />
        ))}
      {visualization
        .reverse()
        .slice(1, rightBars + 1)
        .map((v) => (
          <VisualizerBar height={v} />
        ))}
    </AbsoluteFill>
  );
};

const VisualizerBar: React.FC<{ height: number }> = ({ height }) => {
  return (
    <div
      style={{
        width: 5,
        height: height * 1000,
        backgroundColor: 'currentcolor',
        borderRadius: 10,
      }}
    />
  );
};
