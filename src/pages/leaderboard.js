import LeaderboardContainer from '../components/LeaderboardContainer';
import { YupPageWrapper } from '../components/styles';
import TutorialsProvider from '../providers/TutorialsProvider';
import { LEADERBOARD_TUTORIAL_STEPS } from '../constants/data';
import YupHead from '../components/YupHead';

function Leaderboard() {
  return (
    <>
      <YupHead title="Leaderboard | Yup" description="Leaderboards" />
      <TutorialsProvider steps={LEADERBOARD_TUTORIAL_STEPS}>
        <YupPageWrapper>
          <LeaderboardContainer />
        </YupPageWrapper>
      </TutorialsProvider>
    </>
  );
}

export default Leaderboard;
