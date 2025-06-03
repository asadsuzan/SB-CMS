export const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="border-b border-gray-200 pb-6">
    <h3 className="text-xl font-semibold text-gray-700 mb-4">{title}</h3>
    <div className="space-y-4 pl-1">{children}</div>
  </div>
);