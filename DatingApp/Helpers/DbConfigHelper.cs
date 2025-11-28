using System.Xml.Linq;

namespace DatingApp.Helpers
{
    public static class DbConfigHelper
    {
        public static string GetConnectionString()
        {
            string XmlfilePath = "XMLFiles/DBConfig.xml";
            string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, XmlfilePath);

            if (!File.Exists(path))
                throw new FileNotFoundException("DBConfig.xml not found in bin folder.", path);

            XDocument doc = XDocument.Load(path);

            var activeDb = doc.Descendants("Database")
                .FirstOrDefault(x =>
                    (string?)x.Attribute("Active") == "1" &&
                    (string?)x.Attribute("Type") == "SQLServer");

            if (activeDb == null)
                throw new Exception("Active SQLServer configuration not found in DBConfig.xml");

            string dataSource = activeDb.Element("Data_Source")?.Value
                                ?? throw new Exception("Data_Source missing");

            string userId = activeDb.Element("User_Id")?.Value
                            ?? throw new Exception("User_Id missing");

            string catalog = activeDb.Element("Initial_Catalog")?.Value
                             ?? throw new Exception("Initial_Catalog missing");

            string password = activeDb.Element("Password")?.Value
                              ?? throw new Exception("Password missing");

            return $"Server={dataSource};Database={catalog};User Id={userId};Password={password};TrustServerCertificate=True;Encrypt=False;";
        }
    }
}
