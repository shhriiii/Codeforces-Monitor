import { render, screen } from '@testing-library/react';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}), { virtual: true });

const StudentList = require('./StudentList').default;

test('renders the Codeforces handle search', () => {
  render(<StudentList />);
  expect(screen.getByRole('heading', { name: /codeforces progress tracker/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/codeforces username/i)).toBeInTheDocument();
});
