import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DynamicTitle = () => {
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        let title = 'JobPortal - Intelligent Recruitment System';

        // simple mapping logic
        if (path === '/') title = 'Home | JobPortal';
        else if (path === '/login') title = 'Login | JobPortal';
        else if (path === '/register') title = 'Join Us | JobPortal';
        else if (path === '/app') title = 'Dashboard | JobPortal';
        else if (path.startsWith('/app/users')) title = 'User Management | JobPortal';
        else if (path.startsWith('/app/candidates')) title = 'Candidates | JobPortal';
        else if (path.startsWith('/app/admin/candidate/')) title = 'Candidate Profile | JobPortal';

        document.title = title;
    }, [location]);

    return null; // This component doesn't render anything visible
};

export default DynamicTitle;
