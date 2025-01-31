import { expect } from '@playwright/test';
import test from '../../../fixtures/next';

import ClarasOnboarding from '../../../mockData/orgs/KPD/journeys/MemberOnboarding/instances/ClarasOnboarding';
import KPD from '../../../mockData/orgs/KPD';
import MemberOnboarding from '../../../mockData/orgs/KPD/journeys/MemberOnboarding';
import { ZetkinJourneyInstance } from '../../../../src/types/zetkin';

test.describe('Journey instance page', () => {
  test.beforeEach(async ({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
  });

  test.afterEach(async ({ moxy }) => {
    moxy.teardown();
  });

  test('shows journey instance', async ({ appUri, moxy, page }) => {
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journeys/${MemberOnboarding.id}`,
      'get',
      MemberOnboarding
    );
    moxy.setZetkinApiMock(
      `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
      'get',
      ClarasOnboarding
    );

    await page.goto(appUri + '/organize/1/journeys/1/1');

    expect(
      await page.locator(`text=${ClarasOnboarding.title}`).count()
    ).toEqual(2);
  });

  test.describe('Editing the journey summary', () => {
    test('User can edit summary', async ({ appUri, moxy, page }) => {
      moxy.setZetkinApiMock(
        `/orgs/${KPD.id}/journeys/${MemberOnboarding.id}`,
        'get',
        MemberOnboarding
      );

      moxy.setZetkinApiMock(
        `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
        'get',
        ClarasOnboarding
      );

      const newSummaryText = 'This is the new summary text. Wow!';

      const { log: patchJourneyReqLog } = moxy.setZetkinApiMock(
        `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
        'patch',
        { ...ClarasOnboarding, summary: newSummaryText }
      );

      await page.goto(appUri + '/organize/1/journeys/1/1');

      await page.click('data-testid=JourneyInstanceSummary-saveEditButton');

      await page.fill(
        'data-testid=JourneyInstanceSummary-textArea',
        newSummaryText
      );

      await page.click('data-testid=JourneyInstanceSummary-saveEditButton');

      // Makes request with correct data
      expect(
        patchJourneyReqLog<ZetkinJourneyInstance>()[0].data?.summary
      ).toEqual(newSummaryText);
    });

    test('Shows error if error making request', async ({
      appUri,
      moxy,
      page,
    }) => {
      moxy.setZetkinApiMock(
        `/orgs/${KPD.id}/journeys/${MemberOnboarding.id}`,
        'get',
        MemberOnboarding
      );

      moxy.setZetkinApiMock(
        `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
        'get',
        ClarasOnboarding
      );

      const newSummaryText = 'This is the new summary text. Wow!';

      moxy.setZetkinApiMock(
        `/orgs/${KPD.id}/journey_instances/${ClarasOnboarding.id}`,
        'patch',
        undefined,
        401
      );

      await page.goto(appUri + '/organize/1/journeys/1/1');

      await page.click('data-testid=JourneyInstanceSummary-saveEditButton');

      await page.fill(
        'data-testid=JourneyInstanceSummary-textArea',
        newSummaryText
      );

      await page.click('data-testid=JourneyInstanceSummary-saveEditButton');

      expect(await page.locator('data-testid=Snackbar-error').count()).toEqual(
        1
      );
    });
  });
});
