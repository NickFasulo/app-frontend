import { useTour } from '@reactour/tour';
import { TutorialsFab } from './styles';

function TutorialsButton() {
  const { setIsOpen } = useTour();

  return (
    <TutorialsFab variant="extended" onClick={() => setIsOpen(true)}>
      10 Seconds Tutorial
    </TutorialsFab>
  );
}

export default TutorialsButton;
