import ScheduleIcon from '@material-ui/icons/Schedule';
import { useRouter } from 'next/router';
import { FormattedDate, FormattedMessage as Msg, useIntl } from 'react-intl';

import { journeyInstanceResource } from 'api/journeys';
import TabbedLayout from './TabbedLayout';
import { ZetkinJourneyInstance } from 'types/zetkin';
import ZetkinRelativeTime from 'components/ZetkinRelativeTime';
import { Box, Chip, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  closedChip: {
    backgroundColor: theme.palette.error.main,
    color: 'white',
    fontWeight: 'bold',
    marginRight: '1rem',
  },
  openChip: {
    backgroundColor: theme.palette.success.main,
    color: 'white',
    fontWeight: 'bold',
    marginRight: '1rem',
  },
}));

const JourneyStatusChip = ({
  instance,
}: {
  instance: ZetkinJourneyInstance;
}) => {
  const intl = useIntl();
  const classes = useStyles();
  return !instance.closed ? (
    <Chip
      className={classes.openChip}
      label={intl.formatMessage({
        id: 'layout.organize.journeys.statusOpen',
      })}
    />
  ) : (
    <Chip
      className={classes.closedChip}
      label={intl.formatMessage({
        id: 'layout.organize.journeys.statusClosed',
      })}
    />
  );
};

const JourneyInstanceLayout: React.FunctionComponent = ({ children }) => {
  const { orgId, journeyId, instanceId } = useRouter().query;

  const journeyInstanceQuery = journeyInstanceResource(
    orgId as string,
    instanceId as string
  ).useQuery();
  const journeyInstance = journeyInstanceQuery.data as ZetkinJourneyInstance;

  return (
    <TabbedLayout
      baseHref={`/organize/${orgId}/journeys/${journeyId}/${instanceId}`}
      defaultTab="/"
      subtitle={
        <Box
          style={{
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <JourneyStatusChip instance={journeyInstance} />
          <Typography style={{ marginRight: '1rem' }}>
            <Msg id="layout.organize.journeys.lastActivity" />{' '}
            <ZetkinRelativeTime datetime={journeyInstance.updated} />
          </Typography>
          {journeyInstance.next_milestone && (
            <>
              <ScheduleIcon
                color="secondary"
                style={{ marginRight: '0.25rem' }}
              />
              <Typography>
                {journeyInstance.next_milestone.title}
                {': '}
                {journeyInstance.next_milestone.deadline && (
                  <FormattedDate
                    day="numeric"
                    month="long"
                    value={journeyInstance.next_milestone.deadline}
                    year="numeric"
                  />
                )}
              </Typography>
            </>
          )}
        </Box>
      }
      tabs={[
        {
          href: '/',
          messageId: 'layout.organize.journeys.tabs.timeline',
        },
      ]}
      title={
        <>
          {`${journeyInstance.title || journeyInstance.journey.title} `}
          <Typography
            color="secondary"
            variant="h3"
          >{`\u00A0#${journeyInstance.id}`}</Typography>
        </>
      }
    >
      {children}
    </TabbedLayout>
  );
};

export default JourneyInstanceLayout;
