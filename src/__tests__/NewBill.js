/**
 * @jest-environment jsdom
 */

import { screen, fireEvent } from "@testing-library/dom"
import { waitFor } from "@testing-library/dom"
import NewBill from "../containers/NewBill.js"
import mockStore from "../__mocks__/store"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import userEvent from "@testing-library/user-event";
import BillsUI from "../views/BillsUI.js"
jest.mock("../app/Store", () => mockStore)

describe("Given I am connected as an employee", () => {
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

    const NewBillClass = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage });
    const mockFile = new File(['mock'], 'mock.pdf', { type: 'pdf' });
    await waitFor(() => {
      screen.getByTestId('file');
    });
    const fileInput = screen.getByTestId('file');
    userEvent.upload(fileInput, mockFile);

    const handleChangeFile = jest.fn((e) => NewBillClass.handleChangeFile(e));
    fireEvent.click(fileInput, handleChangeFile);
    expect(jest.spyOn(mockStore, "bills")).not.toHaveBeenCalled()

    try {
      fireEvent.click(fileInput, handleChangeFile);
    } catch (error) {
      expect(error).toMatch('Seuls les fichiers jpg, jpeg et png sont acceptés');
    }
  })

  test("Then if the uploaded file format is good, the store is called and the file is uploaded", async () => {
    jest.mock("../app/Store", () => mockStore);

    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.append(root)
    router()
    window.onNavigate(ROUTES_PATH.NewBill)

    const mockFile = new File(['mock'], 'mock.jpg', { type: 'image/jpg' });
    await waitFor(() => screen.getByTestId('file'));

    const fileInput = screen.getByTestId('file');
    userEvent.upload(fileInput, mockFile);

    const NewBillClass = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage });
    const handleChangeFile = jest.fn((e) => NewBillClass.handleChangeFile(e));
    fireEvent.click(fileInput, handleChangeFile);
    expect(jest.spyOn(mockStore, "bills")).toHaveBeenCalled();
  })

  test("Then if the form is submitted, the store is called and the bill is created", async () => {
    jest.mock("../app/Store", () => mockStore);

    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.append(root)
    router()
    window.onNavigate(ROUTES_PATH.NewBill)

    const NewBillClass = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage });
    const handleSubmit = jest.fn((e) => NewBillClass.handleSubmit(e));
    const form = screen.getByTestId('form-new-bill');
    const mockFile = new File(['mock'], 'mock.jpg', { type: 'image/jpg' });
    NewBillClass.fileName = "fake.png"
    await waitFor(() => screen.getByTestId('file'));
    const fileInput = screen.getByTestId('file');
    userEvent.upload(fileInput, mockFile);

    const handleChangeFile = jest.fn((e) => NewBillClass.handleChangeFile(e));
    fireEvent.click(fileInput, handleChangeFile);

    fireEvent.submit(form, handleSubmit);

    expect(jest.spyOn(mockStore, "bills")).toHaveBeenCalled();
    expect(window.location.href).toContain(ROUTES_PATH['Bills']);
    expect(NewBillClass.p.style.display).toContain("none");
  })

  test("then I upload file, API doesn't answer and return 500 error", async () => {
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

    mockStore.bills.mockImplementationOnce(() => {
      return {
        create: () => {
          return Promise.reject(new Error("Erreur 500"))
        }
      }
    })

    const NewBillClass = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage });
    const mockFile = new File(['mock'], 'mock.jpg', { type: 'image/jpg' });
    await waitFor(() => {
      screen.getByTestId('file');
    });
    const fileInput = screen.getByTestId('file');
    userEvent.upload(fileInput, mockFile);

    const handleChangeFile = jest.fn((e) => NewBillClass.handleChangeFile(e));

    try {
      fireEvent.click(fileInput, handleChangeFile);
    } catch (error) {
      expect(error).toContain('500');
    }
  })

  test("then I upload file, API doesn't answer and return 404 error", async () => {
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

    mockStore.bills.mockImplementationOnce(() => {
      return {
        create: () => {
          return Promise.reject(new Error("Erreur 404"))
        }
      }
    })

    const NewBillClass = new NewBill({ document, onNavigate, store: mockStore, localStorage: window.localStorage });
    const mockFile = new File(['mock'], 'mock.jpg', { type: 'image/jpg' });
    await waitFor(() => {
      screen.getByTestId('file');
    });
    const fileInput = screen.getByTestId('file');
    userEvent.upload(fileInput, mockFile);

    const handleChangeFile = jest.fn((e) => NewBillClass.handleChangeFile(e));

    try {
      fireEvent.click(fileInput, handleChangeFile);
    } catch (error) {
      expect(error).toContain('404');
    }
  })
})