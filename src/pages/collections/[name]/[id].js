import { useRouter } from 'next/router';
import CollectionDetails from '../../../components/CollectionDetails';
import TutorialsProvider from '../../../providers/TutorialsProvider';
import { COLLECTIONS_TUTORIAL_STEPS } from '../../../constants/data';

function Collections() {
  const { query } = useRouter();
  const { id } = query;

  if (!id) return null;

  return (
    <TutorialsProvider steps={COLLECTIONS_TUTORIAL_STEPS}>
      <CollectionDetails id={id} />
    </TutorialsProvider>
  );
}

export default Collections;
