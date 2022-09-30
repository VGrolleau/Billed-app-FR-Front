/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
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

    /**
     * TODO: write a test for the modal
     */
    test("Then I click on eye icon should open modal image", async () => {
      // document.body.innerHTML = BillsUI({ data: bills });
      // Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      // window.localStorage.setItem('user', JSON.stringify({
      //   type: 'Employee'
      // }));

      // const root = document.createElement("div");
      // root.setAttribute("id", "root");
      // document.body.append(root);
      // router();

      // window.onNavigate(ROUTES_PATH.Bills);

      // const billsClass = new Bills({ document, onNavigate, store: mockStore, localStorage: null });
      // const handleClickIconEye = await billsClass.handleClickIconEye();

      // await waitFor(() => screen.getByTestId('icon-eye'));
      // const iconEye = screen.getByTestId('icon-eye');
      // iconEye.addEventListener('click', handleClickIconEye);
      // userEvent.click(iconEye);

      // expect(handleClickIconEye).toHaveBeenCalled();

      // const modal = screen.getByTestId('modale');
      // expect(modal).toBeTruthy();
    });
  })
})

/**
 * TODO: write integration tests for GET Bills
 */
// describe("Given I am a user connected as an employee", () => {
//   describe("When I am on Bills Page", () => {
//     test("fetches bills from mock API GET", async () => {
//       localStorage.setItem("user", JSON.stringify({ type: "employee", email: "a@a" }));
//       const root = document.createElement("div")
//       root.setAttribute("id", "root")
//       document.body.append(root)
//       router()
//       window.onNavigate(ROUTES_PATH.Dashboard)
//       await waitFor(() => screen.getByText("Validations"))
//       const contentPending = await screen.getByText("En attente (1)")
//       expect(contentPending).toBeTruthy()
//       const contentRefused = await screen.getByText("Refusé (2)")
//       expect(contentRefused).toBeTruthy()
//       expect(screen.getByTestId("big-billed-icon")).toBeTruthy()
//     })
//     describe("When an error occurs on API", () => {
//       beforeEach(() => {
//         jest.spyOn(mockStore, "bills")
//         Object.defineProperty(
//           window,
//           'localStorage',
//           { value: localStorageMock }
//         )
//         window.localStorage.setItem('user', JSON.stringify({
//           type: 'employee',
//           email: "a@a"
//         }))
//         const root = document.createElement("div")
//         root.setAttribute("id", "root")
//         document.body.appendChild(root)
//         router()
//       })

//       test("fetches bills from an API and fails with 404 message error", async () => {
//         mockStore.bills.mockImplementationOnce(() => {
//           return {
//             list: () => {
//               return Promise.reject(new Error("Erreur 404"))
//             }
//           }
//         })
//         window.onNavigate(ROUTES_PATH.Dashboard)
//         await new Promise(process.nextTick);
//         const message = await screen.getByText(/Erreur 404/)
//         expect(message).toBeTruthy()
//       })

//       test("fetches messages from an API and fails with 500 message error", async () => {
//         mockStore.bills.mockImplementationOnce(() => {
//           return {
//             list: () => {
//               return Promise.reject(new Error("Erreur 500"))
//             }
//           }
//         })

//         window.onNavigate(ROUTES_PATH.Dashboard)
//         await new Promise(process.nextTick);
//         const message = await screen.getByText(/Erreur 500/)
//         expect(message).toBeTruthy()
//       })
//     })
//   })
// })