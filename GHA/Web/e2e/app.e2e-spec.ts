import { OrderManagementPage } from './app.po';

describe('order-management App', () => {
  let page: OrderManagementPage;

  beforeEach(() => {
    page = new OrderManagementPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
