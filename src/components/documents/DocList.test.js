import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import DocList from '../DocList';

global.fetch = jest.fn();

const mockDocs = [
    { _id: '1', title: 'Doc 1', content: 'text for doc 1' },
    { _id: '2', title: 'Doc 2', content: 'text for doc 2' }
];

beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockImplementation((url, options) => {
        if (options && options.method === 'DELETE') {
            return Promise.resolve({ ok: true });
        }

        return Promise.resolve({
            json: () => Promise.resolve(mockDocs),
        });
    });
});

test('renders Link to new doc', () => {
    render(
        <Router>
            <DocList />
        </Router>
    );
    const createNewDocLink = screen.getByText(/Create New Document/i);
    expect(createNewDocLink).toBeInTheDocument();
    expect(createNewDocLink.closest('a')).toHaveAttribute('href', '/document/new');
});

test('renders docs', async () => {
    await act(async () => {
        render(
            <Router>
                <DocList />
            </Router>
        );
    });

    expect(screen.getByText(/Doc 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Doc 2/i)).toBeInTheDocument();
});

test('delete button deletes doc', async () => {
    await act(async () => {
        render(
            <Router>
                <DocList />
            </Router>
        );
    });

    const user = userEvent.setup();

    const deleteButton = screen.getAllByText(/Delete/i)[0];

    await act(async () => {
        await user.click(deleteButton);
    });

    expect(fetch).toHaveBeenCalledWith('https://jsramverk-editor-tesi23-beh7hvfadub6fugk.northeurope-01.azurewebsites.net/1', { 
        method: 'DELETE' 
    });

    expect(screen.queryByText(/Doc 1/i)).not.toBeInTheDocument();

    expect(screen.getByText(/Doc 2/i)).toBeInTheDocument();
});
