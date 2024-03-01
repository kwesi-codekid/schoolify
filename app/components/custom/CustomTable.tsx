/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Spinner,
  Tooltip,
  useDisclosure,
  Button,
  Input,
  Pagination,
} from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { EyeOutlined } from "~/assets/icons/EyeOutlined";
import { EditIcon } from "~/assets/icons/EditIcon";
import { DeleteIcon } from "~/assets/icons/DeleteIcon";
import { PlusIcon } from "~/assets/icons/PlusIcon";
import ConfirmModal from "./ConfirmModal";
import CreateRecordModal from "./CreateRecordModal";
import EditRecordModal from "./EditRecordModal";
import { useNavigate, Form } from "@remix-run/react";
import emptyFolderSVG from "~/assets/svgs/empty_folder.svg";

interface Column {
  key: string;
  name: string;
}

interface Item {
  [key: string]: any;
}

interface CustomTableProps {
  items: Item[];
  columns: Column[];
  addButtonText: string;
  createRecordFormItems?: React.ReactNode;
  editRecordFormItems?: React.ReactNode;
  editRecord: any;
  setEditRecord: (record: any) => void;
  currentPage?: number;
  totalPages: number;
  searchTerm?: string;
}

const CustomTable: React.FC<CustomTableProps> = ({
  items,
  columns,
  addButtonText,
  createRecordFormItems,
  editRecordFormItems,
  editRecord,
  setEditRecord,
  currentPage,
  totalPages,
  searchTerm,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(true);

  const list = useAsyncList({
    async load() {
      setIsLoading(false);

      return {
        items: items,
      };
    },
    async sort({ items, sortDescriptor }) {
      return {
        items: items.sort((a, b) => {
          const first = a[sortDescriptor.column];
          const second = b[sortDescriptor.column];
          let cmp =
            (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  useEffect(() => {
    list.reload();
  }, [items]);

  // delete record stuff
  const deleteDisclosure = useDisclosure();
  const [deleteId, setDeleteId] = React.useState<string>("");
  const openDeleteModal = (deleteId: string) => {
    setDeleteId(deleteId);
    deleteDisclosure.onOpen();
  };

  // create record stuff
  const createRecordDisclosure = useDisclosure();
  const openCreateRecordModal = () => {
    createRecordDisclosure.onOpen();
  };

  // edit record stuff
  const editRecordDisclosure = useDisclosure();
  const openEditRecordModal = (record: any) => {
    setEditRecord(record);
    editRecordDisclosure.onOpen();
  };

  // table top content
  const tableTopContent = (
    <div className="flex items-center justify-between">
      <div className="w-1/3 rounded-xl flex items-center gap-2">
        <Form method="get" className="flex items-center justify-center gap-2">
          <Input
            className="rounded-xl"
            classNames={{
              inputWrapper: "!h-10",
            }}
            name="search_term"
            radius="lg"
            defaultValue={searchTerm}
            size="sm"
          />
          <Button
            className="h-10 font-montserrat"
            color="primary"
            variant="flat"
            type="submit"
          >
            Search
          </Button>
        </Form>
      </div>
      <Button
        className="font-montserrat"
        size="md"
        color="primary"
        startContent={<PlusIcon />}
        onPress={openCreateRecordModal}
      >
        <Input className="hidden" name="intent" value={"create"} />
        {addButtonText}
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {tableTopContent}
      <Table
        aria-label="Custom data table"
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
        removeWrapper
        className="h-[50vh]"
        classNames={{
          table: "w-full",
          // thead: "relative -top-4",
        }}
        isHeaderSticky
        bottomContent={
          totalPages > 0 ? (
            <div className="flex w-full items-center">
              <Pagination
                showControls
                showShadow
                color="primary"
                page={currentPage}
                total={totalPages}
                onChange={(page) => {
                  let baseUrl = location.pathname + location.search;
                  let regex = /([?&]page=)\d+/g;

                  if (
                    baseUrl.includes("?page=") ||
                    baseUrl.includes("&page=")
                  ) {
                    baseUrl = baseUrl.replace(regex, `$1${page}`);
                  } else {
                    baseUrl += baseUrl.includes("?")
                      ? `&page=${page}`
                      : `?page=${page}`;
                  }

                  navigate(baseUrl);
                }}
              />
            </div>
          ) : null
        }
      >
        <TableHeader className="!bg-blue-500">
          {columns.map((column) => (
            <TableColumn
              className="font-montserrat bg-slate-900"
              key={column.key}
              allowsSorting
            >
              {column.name}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody
          items={list.items}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
          emptyContent={
            <div className="flex items-center justify-center flex-col gap-3">
              <img src={emptyFolderSVG} alt="No data" />
              <p className="font-nunito text-lg md:text-xl">No records found</p>
            </div>
          }
        >
          {(item: any) => (
            <TableRow key={item._id}>
              {(columnKey) => {
                return columnKey === "actions" ? (
                  <TableCell key={columnKey}>
                    <div className="relative flex items-center">
                      <Tooltip content="Details">
                        <Button
                          variant="light"
                          radius="full"
                          color="default"
                          isIconOnly
                          size="sm"
                        >
                          <EyeOutlined className="size-4" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Edit user">
                        <Button
                          variant="light"
                          radius="full"
                          color="primary"
                          isIconOnly
                          size="sm"
                          onClick={() => openEditRecordModal(item)}
                        >
                          <EditIcon className="size-4" />
                        </Button>
                      </Tooltip>
                      <Tooltip color="danger" content="Delete user">
                        <Button
                          onClick={() => openDeleteModal(item._id)}
                          variant="light"
                          radius="full"
                          color="danger"
                          isIconOnly
                          size="sm"
                        >
                          <DeleteIcon className="size-4" />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
                ) : (
                  <TableCell className="font-nunito text-sm" key={columnKey}>
                    {getKeyValue(item, columnKey)}
                  </TableCell>
                );
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* create modal */}
      <CreateRecordModal
        title="Create Record"
        isModalOpen={createRecordDisclosure.isOpen}
        onCloseModal={createRecordDisclosure.onClose}
      >
        {createRecordFormItems}
      </CreateRecordModal>

      {/* edit modal */}
      <EditRecordModal
        record={editRecord}
        title="Edit Record"
        isModalOpen={editRecordDisclosure.isOpen}
        onCloseModal={editRecordDisclosure.onClose}
      >
        {editRecordFormItems}
      </EditRecordModal>

      {/* delete modal */}
      <ConfirmModal
        title="Delete Record"
        isModalOpen={deleteDisclosure.isOpen}
        onCloseModal={deleteDisclosure.onClose}
        formMethod="POST"
        formAction=""
      >
        <Input className="hidden" name="intent" value={"delete"} />
        <Input className="hidden" name="_id" value={deleteId} />
        <p className="font-nunito">
          Are you sure you want to delete this user?
        </p>
      </ConfirmModal>
    </div>
  );
};

export default CustomTable;
