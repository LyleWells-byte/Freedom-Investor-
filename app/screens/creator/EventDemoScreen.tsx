import React from 'react';
import EventDemoPlayer from '../../components/creator/EventDemoPlayer';

interface Props {
  route?: { params?: { creatorCode?: string; creatorName?: string } };
  navigation: { goBack: () => void };
}

export default function EventDemoScreen({ route, navigation }: Props) {
  const creatorCode = route?.params?.creatorCode ?? 'lyle';
  const creatorName = route?.params?.creatorName ?? 'Lyle Wells';
  return <EventDemoPlayer creatorCode={creatorCode} creatorName={creatorName} onExit={() => navigation.goBack()} />;
}
