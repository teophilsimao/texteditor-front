import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import DocForm from '../DocForm';
// import { act } from 'react';

global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({}),
    })
);
  
beforeEach(() => {
    jest.clearAllMocks();
});

test('renders Title label', () => {
  render(
    <MemoryRouter>
        <DocForm />
    </MemoryRouter>);
  const labelElement = screen.getByText(/title/i);
  expect(labelElement).toBeInTheDocument();
});

test('renders Content label', () => {
    render(
        <MemoryRouter>
            <DocForm />
        </MemoryRouter>);
    const labelElement = screen.getByText(/content/i);
    expect(labelElement).toBeInTheDocument();
});

test('Testing value for title when entered', async () => {
    render(
        <MemoryRouter>
            <DocForm />
        </MemoryRouter>);
    const inputValue= 'Hej';
    const user = userEvent.setup();
    const titleInput = screen.getByLabelText("Title:")

    await act(async () => {
        await user.type(titleInput, inputValue);
    });
    expect(titleInput).toHaveValue(inputValue);
});

test('Testing value for content when entered', async () => {
    render(
        <MemoryRouter>
            <DocForm />
        </MemoryRouter>);
    const inputValue= 'Hej';
    const user = userEvent.setup();
    const contentInput = screen.getByLabelText("Content:")

    await act(async () => {
        await user.type(contentInput, inputValue);
    });
    expect(contentInput).toHaveValue(inputValue);
});

test('Testing create button', async () => {
    render(
        <MemoryRouter>
            <DocForm />
        </MemoryRouter>);
    const titleValue= 'Hej';
    const contentValue= 'Hahahah';
    const user = userEvent.setup();
    const titleInput = screen.getByLabelText("Title:")
    const contentInput = screen.getByLabelText("Content:")
    const submitButton = screen.getByRole('button', { name: /create/i });

    await act(async () => {
        await user.type(titleInput, titleValue);
        await user.type(contentInput, contentValue);
    });

    await act(async () => {
        await user.click(submitButton);
    });

    expect(fetch).toHaveBeenCalledWith('https://jsramverk-editor-tesi23-beh7hvfadub6fugk.northeurope-01.azurewebsites.net/', expect.objectContaining({
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: titleValue, content: contentValue }),
    }));
});
