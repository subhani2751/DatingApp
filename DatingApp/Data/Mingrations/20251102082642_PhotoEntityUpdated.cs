using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DatingApp.Data.Mingrations
{
    /// <inheritdoc />
    public partial class PhotoEntityUpdated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Members_MembersID",
                table: "Photos");

            migrationBuilder.DropIndex(
                name: "IX_Photos_MembersID",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "MembersID",
                table: "Photos");

            migrationBuilder.RenameColumn(
                name: "MyProperty",
                table: "Members",
                newName: "DateofBirth");

            migrationBuilder.AlterColumn<string>(
                name: "sPublicId",
                table: "Photos",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "memberId",
                table: "Photos",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Photos_memberId",
                table: "Photos",
                column: "memberId");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Members_memberId",
                table: "Photos",
                column: "memberId",
                principalTable: "Members",
                principalColumn: "sID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Members_memberId",
                table: "Photos");

            migrationBuilder.DropIndex(
                name: "IX_Photos_memberId",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "memberId",
                table: "Photos");

            migrationBuilder.RenameColumn(
                name: "DateofBirth",
                table: "Members",
                newName: "MyProperty");

            migrationBuilder.AlterColumn<string>(
                name: "sPublicId",
                table: "Photos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MembersID",
                table: "Photos",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Photos_MembersID",
                table: "Photos",
                column: "MembersID");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Members_MembersID",
                table: "Photos",
                column: "MembersID",
                principalTable: "Members",
                principalColumn: "sID");
        }
    }
}
