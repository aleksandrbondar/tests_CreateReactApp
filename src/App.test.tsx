/* eslint-disable jest/no-identical-title */
import { render, waitFor, screen } from "@testing-library/react";
import App from "./App";

describe('App', () => {
  let fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([{
        id: 1,
        title: 'test title',
        body: 'test body'
      },
      {
        id: 2,
        title: 'test title 2',
        body: 'test body 2'
      }
      ])
    });
    global.fetch = fetchMock;
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  test('To have a call', async () => {
    render(<App />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  })

  test('To have a titles', async () => {
    render(<App />);
    const postsTitle = await screen.findAllByRole('heading', { name: /test title/i });
    expect(postsTitle.length).toBeGreaterThan(0);
  })

  test('To have a body', async () => {
    render(<App />);
    const postsBody = await screen.findAllByText(/test body/i);
    expect(postsBody).toHaveLength(2);
  })

  test('Display error message when fetch fail', async () => {
    fetchMock.mockRejectedValueOnce(new Error('error'));
    render(<App />);
    const error = await screen.findByText(/error/i);
    expect(error).toBeInTheDocument();
  })

  test('Loading indcator when loading', async () => {
    fetchMock.mockImplementationOnce(() => new Promise((resolve) => { setTimeout(() => { resolve({ ok: true, json: () => Promise.resolve([]) }) }, 1000) }));
    render(<App />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/loading/i)).toBeNull(), { timeout: 2000 });
  })

  test('Not loading when not loading', async () => {
    render(<App />);
    const notLoading = await screen.findByText(/loaded/i);
    expect(notLoading).toBeInTheDocument();
  })
})



