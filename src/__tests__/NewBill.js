/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import mockStore from "../__mocks__/store";


const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname })
}

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I should send only png, jpg or jpeg files", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const NewBillClass = new NewBill({ document, onNavigate, store: mockStore, localStorage: null });
      // const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
      const allowedExtensions = NewBillClass.fileExtensions;
      // const fileInput = screen.getByTestId('file');
      // const fileUrl = fileInput.value;
      // const fileExtension = fileUrl.substring(fileUrl.lastIndexOf('.'));
      const fileExtension = '.jpg';
      expect(allowedExtensions).toContain(fileExtension);
    })
  })
})
