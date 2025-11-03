using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DatingApp.Data.Mingrations
{
    /// <inheritdoc />
    public partial class MemberEntityAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "sImageUrl",
                table: "users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Members",
                columns: table => new
                {
                    sID = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    MyProperty = table.Column<DateOnly>(type: "date", nullable: false),
                    sImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    sDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastActive = table.Column<DateTime>(type: "datetime2", nullable: false),
                    sGender = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    sDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    sCity = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    sCountry = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Members", x => x.sID);
                    table.ForeignKey(
                        name: "FK_Members_users_sID",
                        column: x => x.sID,
                        principalTable: "users",
                        principalColumn: "sID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Photos",
                columns: table => new
                {
                    sId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    sUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    sPublicId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MembersID = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Photos", x => x.sId);
                    table.ForeignKey(
                        name: "FK_Photos_Members_MembersID",
                        column: x => x.MembersID,
                        principalTable: "Members",
                        principalColumn: "sID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Photos_MembersID",
                table: "Photos",
                column: "MembersID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Photos");

            migrationBuilder.DropTable(
                name: "Members");

            migrationBuilder.DropColumn(
                name: "sImageUrl",
                table: "users");
        }
    }
}
