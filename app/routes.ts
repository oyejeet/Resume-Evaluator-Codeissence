import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('/auth', 'routes/auth.tsx'),
    route('/upload', 'routes/upload.tsx'),
    route('/resume/:id', 'routes/resume.tsx'),
    route('/admin', 'routes/admin.tsx'),
    route('/jobs', 'routes/jobs.tsx'),
    route('/applied', 'routes/applied.tsx'),
    route('/wipe', 'routes/wipe.tsx'),
] satisfies RouteConfig;
