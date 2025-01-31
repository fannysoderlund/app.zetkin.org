import { expect, Page } from '@playwright/test';
import test, { NextWorkerFixtures } from '../../../../fixtures/next';

import AllMembers from '../../../../mockData/orgs/KPD/people/views/AllMembers';
import AllMembersColumns from '../../../../mockData/orgs/KPD/people/views/AllMembers/columns';
import AllMembersRows from '../../../../mockData/orgs/KPD/people/views/AllMembers/rows';
import KPD from '../../../../mockData/orgs/KPD';

const deleteView = async (page: Page) => {
  await page.click('data-testid=EllipsisMenu-menuActivator');
  await page.click(`data-testid=EllipsisMenu-item-delete-view`);
  await page.click('button > :text("Confirm")');
};

const expectDeleteViewError = async (page: Page) => {
  await page.locator('data-testid=Snackbar-error').waitFor();
  const canSeeErrorSnackbar = await page
    .locator('data-testid=Snackbar-error')
    .isVisible();
  expect(canSeeErrorSnackbar).toBeTruthy();
};

const expectDeleteViewSuccess = (moxy: NextWorkerFixtures['moxy']) => {
  const deleteViewRequest = moxy
    .log()
    .find(
      (mock) =>
        mock.method === 'DELETE' &&
        mock.path === `/v1/orgs/1/people/views/${AllMembers.id}`
    );
  expect(deleteViewRequest).toBeTruthy();
};

test.describe('Delete view from view list page', () => {
  test.beforeEach(({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('user can delete a view from a menu in the list', async ({
    page,
    appUri,
    moxy,
  }) => {
    moxy.setZetkinApiMock('/orgs/1/people/views', 'get', [AllMembers]);
    moxy.setZetkinApiMock(
      `/orgs/1/people/1/views/${AllMembers.id}`,
      'delete',
      undefined,
      204
    );

    await page.goto(appUri + '/organize/1/people');

    await deleteView(page);
    expectDeleteViewSuccess(moxy);
  });

  test('shows an error if view deletion fails', async ({
    page,
    appUri,
    moxy,
  }) => {
    moxy.setZetkinApiMock('/orgs/1/people/views', 'get', [AllMembers]);
    moxy.setZetkinApiMock(
      `/orgs/1/people/1/views/${AllMembers.id}`,
      'delete',
      undefined,
      405
    );

    await page.goto(appUri + '/organize/1/people');

    await deleteView(page);
    await expectDeleteViewError(page);
  });
});

test.describe('Delete view from view detail page', () => {
  test.beforeEach(({ moxy, login }) => {
    login();
    moxy.setZetkinApiMock('/orgs/1', 'get', KPD);
  });

  test.afterEach(({ moxy }) => {
    moxy.teardown();
  });

  test('successfully deletes a view', async ({ page, appUri, moxy }) => {
    moxy.setZetkinApiMock('/orgs/1/people/views/1', 'get', AllMembers);
    moxy.setZetkinApiMock('/orgs/1/people/views/1/rows', 'get', AllMembersRows);
    moxy.setZetkinApiMock(
      '/orgs/1/people/views/1/columns',
      'get',
      AllMembersColumns
    );
    moxy.setZetkinApiMock('/orgs/1/people/views/1', 'delete', undefined, 204);

    await page.goto(appUri + '/organize/1/people/views/1');

    await deleteView(page);
    expectDeleteViewSuccess(moxy);

    // Check navigates back to views list
    await page.waitForNavigation();
    await expect(page.url()).toEqual(
      appUri + `/organize/${KPD.id}/people/views`
    );
  });

  test('shows snackbar if error deleting view', async ({
    page,
    appUri,
    moxy,
  }) => {
    moxy.setZetkinApiMock('/orgs/1/people/views/1', 'get', AllMembers);
    moxy.setZetkinApiMock('/orgs/1/people/views/1/rows', 'get', AllMembersRows);
    moxy.setZetkinApiMock(
      '/orgs/1/people/views/1/columns',
      'get',
      AllMembersColumns
    );
    moxy.setZetkinApiMock('/orgs/1/people/views/1', 'delete', undefined, 405);

    await page.goto(appUri + '/organize/1/people/views/1');

    await deleteView(page);
    await expectDeleteViewError(page);
  });
});
