/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";

import router from "../app/Router.js";
import Bills from "../containers/Bills.js";
import userEvent from "@testing-library/user-event";

const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname })
}

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId('icon-window'));
      const windowIcon = screen.getByTestId('icon-window');
      expect(windowIcon.classList.contains('active-icon')).toBe(true);
    })

    test("Then bills should be ordered from earliest to latest", async () => {
      const billsClass = new Bills({ document, onNavigate, store: mockStore, localStorage: null });
      const getBills = await billsClass.getBills();
      const dates = [];
      getBills.forEach(bill => {
        dates.push(bill.date)
      });
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    test("Then I click on new Bill should redirect new Bill page", async () => {
      document.body.innerHTML = BillsUI({ data: bills })
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()

      window.onNavigate(ROUTES_PATH.Bills)

      await waitFor(() => screen.getByTestId('btn-new-bill'))
      const btn = screen.getByTestId('btn-new-bill')
      userEvent.click(btn);

      expect(window.location.href).toContain('#employee/bill/new')
    })

    test("Then I click on eye icon should open modal", async () => {
      $.fn.modal = jest.fn();

      document.body.innerHTML = BillsUI({ data: bills })
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);

      await waitFor(() => screen.getAllByTestId('icon-eye'));
      const iconEye = screen.getAllByTestId('icon-eye')[0];

      const BillsClass = new Bills({ document, onNavigate, store: mockStore, localStorage: window.localStorage });
      const handleClickIconEye = jest.fn(() => BillsClass.handleClickIconEye(iconEye));

      userEvent.click(iconEye, handleClickIconEye);
      expect($.fn.modal).toHaveBeenCalled();
    })
  })
})

describe("Given I am a user connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("fetches bills from mock API GET", async () => {
      document.body.innerHTML = BillsUI({ data: bills })
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }));
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);

      await waitFor(() => document.querySelector(".content-title"));
      expect(document.querySelector(".content-title")).toBeTruthy()
    })
  })
})