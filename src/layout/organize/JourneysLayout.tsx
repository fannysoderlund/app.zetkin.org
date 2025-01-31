import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';

import TabbedLayout from './TabbedLayout';

const JourneysLayout: React.FunctionComponent = ({ children }) => {
  const intl = useIntl();
  const { orgId } = useRouter().query;

  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/journeys`}
      defaultTab="/overview"
      tabs={[
        {
          href: `/overview`,
          messageId: 'layout.organize.journeys.tabs.overview',
        },
      ]}
      title={intl.formatMessage({ id: 'layout.organize.journeys.title' })}
    >
      {children}
    </TabbedLayout>
  );
};

export default JourneysLayout;
