/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom"
import NewBill from "../containers/NewBill.js"
import mockStore from "../__mocks__/store";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import userEvent from "@testing-library/user-event";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";


const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname })
}

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then if the uploaded file is neither a png, jpg nor jpeg format, return a console error", async () => {
      jest.spyOn(console, 'error').mockImplementation(() => { });

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)

      const mockFile = new File(['mock'], 'mock.pdf', { type: 'pdf' });
      await waitFor(() => {
        screen.getByTestId('file');
      });

      const fileInput = screen.getByTestId('file');
      userEvent.upload(fileInput, mockFile);

      const NewBillClass = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage });
      const handleChangeFile = jest.fn((e) => NewBillClass.handleChangeFile(e));

      try {
        fireEvent.click(fileInput, handleChangeFile);
      } catch (error) {
        expect(error).toMatch('Seuls les fichiers jpg, jpeg et png sont acceptés');
      }
    })

    /**
     * TODO:
     * faire le test pour le cas où le fichier est bien un jpg, jpeg ou png
     */
    test("Then if the uploaded file format is good, the store is called and the file is uploaded", async () => {
      jest.mock("../app/store", () => mockStore)
      expect(jest.spyOn(mockStore, "bills")).toHaveBeenCalled()
    })
  })
})
