<template>
  <div class="container">
    <div class="row mt-5">
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Users Table</h3>

            <div class="card-tools">
              <button class="btn btn-success" @click="newModal">
                Create New <i class="fas fa-user-plus"></i>
              </button>
            </div>
          </div>
          <!-- /.card-header -->
          <div class="card-body table-responsive p-0">
            <table class="table table-hover text-nowrap">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Date of Reg</th>

                  <th>Modify</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.type | upperCase }}</td>
                  <td>{{ user.created_at | mydate }}</td>

                  <td>
                    <a href="#" @click="editModal(user)">
                      <i class="fa fa-edit"> </i>
                    </a>
                    <a href="#" @click="deleteUser(user.id)">
                      <i class="fa fa-trash red"> </i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- /.card-body -->
        </div>
        <!-- /.card -->
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="addNew"
      tabindex="-1"
      aria-labelledby="addNewLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 v-show="!editmode" class="modal-title" id="addNewLabel">
              Add New User
            </h5>
            <h5 v-show="editmode" class="modal-title" id="addNewLabel">
              Update User's Info
            </h5>

            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <form @submit.prevent="editmode ? updateUser() : CreateUser()">
            <div class="modal-body">
              <!-- start form -->
              <div class="mb-3">
                <label for="name" class="form-label">Name</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  name="name"
                  class="form-control"
                />
                <HasError :form="form" field="name" />
              </div>

              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="text"
                  name="email"
                  class="form-control"
                />
                <HasError :form="form" field="email" />
              </div>

              <div class="form-group">
                <label for="bio">Bio</label>
                <textarea
                  v-model="form.bio"
                  class="form-control"
                  id="bio"
                  rows="3"
                  placeholder="Short bio for Users"
                ></textarea>
                <HasError :form="form" field="bio" />
              </div>

              <div class="form-group">
                <label for="exampleFormControlSelect1">Select User Role</label>
                <select
                  v-model="form.type"
                  name="type"
                  id="type"
                  class="form-control"
                >
                  <option>Admin</option>
                  <option>Standard User</option>
                  <option>Author</option>
                </select>
                <HasError :form="form" field="type" />
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">password</label>
                <input
                  id="password"
                  v-model="form.password"
                  type="text"
                  name="password"
                  class="form-control"
                />
                <HasError :form="form" field="password" />
              </div>
              <!-- end form -->
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button v-show="editmode" type="submit" class="btn btn-success">
                Update User
              </button>
              <button v-show="!editmode" type="submit" class="btn btn-primary">
                Create User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editmode: false,
      users: {},
      form: new Form({
        id: "",
        name: "",
        email: "",
        type: "",
        bio: "",
        photo: "",
      }),
    };
  },
  created() {
    this.getUSers();
    Fire.$on("afterCreated", () => {
      this.getUSers();
    });
  },

  methods: {
    updateUser() {
      this.$Progress.start();

      this.form
        .put("/api/user/" + this.form.id)
        .then(() => {
          $("#addNew").modal("hide");

          Swal.fire({
            icon: "success",
            title: "User updated successfully",
          });
          this.$Progress.finish();
         Fire.$emit("afterCreated");

        })
        .catch(() => {
          this.$Progress.fail();
        });
    },

    editModal(user) {
      this.editmode = true;
      this.form.reset();
      this.form.clear();

      $("#addNew").modal("show");
      this.form.fill(user);
    },

    newModal() {
      this.editmode = false;
      this.form.reset();
      $("#addNew").modal("show");
    },

    async getUSers() {
      let response = await axios.get("/api/user");
      this.users = await response.data.data;
      //   let response = await axios.get("/api/user").then((result) => this.users =result.data)
    },

    async CreateUser() {
      this.$Progress.start();

      const response = await this.form.post("/api/user").then(() => {
        Fire.$emit("afterCreated");
        this.$Progress.finish();
        $("#addNew").modal("hide");

        Swal.fire({
          icon: "success",
          title: "User created successfully",
        });
      });
    },

    deleteUser(id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        // send ajax request
        if (result.isConfirmed) {
          this.form
            .delete("/api/user/" + id)
            .then(() => {
              Swal.fire("Deleted!", "user has been deleted.", "success");
              Fire.$emit("afterCreated");
            })
            .catch(() => {
              Swal.fire("failed", "something went wrong", "warning");
            });
        }
      });
    },
  },
};
</script>
