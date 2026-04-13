"""
Script de seed: popula o banco de dados com os dados dos CSVs.
Uso: python -m app.seed --data-dir ./data
"""
import argparse
import os
from datetime import datetime
import pandas as pd
from sqlalchemy.orm import Session
from app.database import SessionLocal, Base, engine
from app.models import Consumidor, Produto, Vendedor, Pedido, ItemPedido, AvaliacaoPedido


def parse_datetime(val):
    if pd.isna(val) or val is None or val == "":
        return None
    try:
        return datetime.fromisoformat(str(val))
    except Exception:
        return None


def parse_date(val):
    if pd.isna(val) or val is None or val == "":
        return None
    try:
        return datetime.fromisoformat(str(val)).date()
    except Exception:
        return None


def clean(val):
    if pd.isna(val):
        return None
    return val


def seed(data_dir: str):
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        arquivos = {
            "consumidores": os.path.join(data_dir, "dim_consumidores.csv"),
            "produtos":     os.path.join(data_dir, "dim_produtos.csv"),
            "vendedores":   os.path.join(data_dir, "dim_vendedores.csv"),
            "pedidos":      os.path.join(data_dir, "fat_pedidos.csv"),
            "itens":        os.path.join(data_dir, "fat_itens_pedidos.csv"),
            "avaliacoes":   os.path.join(data_dir, "fat_avaliacoes_pedidos.csv"),
        }

        # Consumidores
        if os.path.exists(arquivos["consumidores"]):
            df = pd.read_csv(arquivos["consumidores"])
            count = 0
            for _, row in df.iterrows():
                if not db.get(Consumidor, row["id_consumidor"]):
                    db.add(Consumidor(
                        id_consumidor=row["id_consumidor"],
                        prefixo_cep=str(clean(row["prefixo_cep"]) or ""),
                        nome_consumidor=str(clean(row["nome_consumidor"]) or ""),
                        cidade=str(clean(row["cidade"]) or ""),
                        estado=str(clean(row["estado"]) or ""),
                    ))
                    count += 1
            db.commit()
            print(f"✅ Consumidores: {count} inseridos de {len(df)}")

        # Vendedores
        if os.path.exists(arquivos["vendedores"]):
            df = pd.read_csv(arquivos["vendedores"])
            count = 0
            for _, row in df.iterrows():
                if not db.get(Vendedor, row["id_vendedor"]):
                    db.add(Vendedor(
                        id_vendedor=row["id_vendedor"],
                        nome_vendedor=str(clean(row["nome_vendedor"]) or ""),
                        prefixo_cep=str(clean(row["prefixo_cep"]) or ""),
                        cidade=str(clean(row["cidade"]) or ""),
                        estado=str(clean(row["estado"]) or ""),
                    ))
                    count += 1
            db.commit()
            print(f"✅ Vendedores: {count} inseridos de {len(df)}")

        # Produtos
        if os.path.exists(arquivos["produtos"]):
            df = pd.read_csv(arquivos["produtos"])
            count = 0
            for _, row in df.iterrows():
                if not db.get(Produto, row["id_produto"]):
                    categoria = clean(row.get("categoria_produto"))
                    if not categoria:
                        continue
                    db.add(Produto(
                        id_produto=row["id_produto"],
                        nome_produto=str(clean(row["nome_produto"]) or ""),
                        categoria_produto=str(categoria),
                        peso_produto_gramas=clean(row.get("peso_produto_gramas")),
                        comprimento_centimetros=clean(row.get("comprimento_centimetros")),
                        altura_centimetros=clean(row.get("altura_centimetros")),
                        largura_centimetros=clean(row.get("largura_centimetros")),
                    ))
                    count += 1
            db.commit()
            print(f"✅ Produtos: {count} inseridos de {len(df)}")

        # Pedidos
        if os.path.exists(arquivos["pedidos"]):
            df = pd.read_csv(arquivos["pedidos"])
            count = 0
            for _, row in df.iterrows():
                if not db.get(Pedido, row["id_pedido"]):
                    db.add(Pedido(
                        id_pedido=row["id_pedido"],
                        id_consumidor=row["id_consumidor"],
                        status=str(clean(row["status"]) or ""),
                        pedido_compra_timestamp=parse_datetime(row.get("pedido_compra_timestamp")),
                        pedido_entregue_timestamp=parse_datetime(row.get("pedido_entregue_timestamp")),
                        data_estimada_entrega=parse_date(row.get("data_estimada_entrega")),
                        tempo_entrega_dias=clean(row.get("tempo_entrega_dias")),
                        tempo_entrega_estimado_dias=clean(row.get("tempo_entrega_estimado_dias")),
                        diferenca_entrega_dias=clean(row.get("diferenca_entrega_dias")),
                        entrega_no_prazo=str(clean(row.get("entrega_no_prazo")) or ""),
                    ))
                    count += 1
            db.commit()
            print(f"✅ Pedidos: {count} inseridos de {len(df)}")

        # Itens de Pedido
        if os.path.exists(arquivos["itens"]):
            df = pd.read_csv(arquivos["itens"])
            count = 0
            for _, row in df.iterrows():
                exists = db.get(ItemPedido, (row["id_pedido"], int(row["id_item"])))
                if not exists:
                    db.add(ItemPedido(
                        id_pedido=row["id_pedido"],
                        id_item=int(row["id_item"]),
                        id_produto=row["id_produto"],
                        id_vendedor=row["id_vendedor"],
                        preco_BRL=float(clean(row["preco_BRL"]) or 0),
                        preco_frete=float(clean(row["preco_frete"]) or 0),
                    ))
                    count += 1
            db.commit()
            print(f"✅ Itens de Pedido: {count} inseridos de {len(df)}")

        # Avaliações
        if os.path.exists(arquivos["avaliacoes"]):
            df = pd.read_csv(arquivos["avaliacoes"])
            df = df.drop_duplicates(subset=["id_avaliacao"])  # remove duplicatas do CSV
            count = 0
            for _, row in df.iterrows():
                if not db.get(AvaliacaoPedido, row["id_avaliacao"]):
                    db.add(AvaliacaoPedido(
                        id_avaliacao=row["id_avaliacao"],
                        id_pedido=row["id_pedido"],
                        avaliacao=int(clean(row["avaliacao"]) or 0),
                        titulo_comentario=str(clean(row.get("titulo_comentario")) or ""),
                        comentario=str(clean(row.get("comentario")) or ""),
                        data_comentario=parse_datetime(row.get("data_comentario")),
                        data_resposta=parse_datetime(row.get("data_resposta")),
                    ))
                    count += 1
            db.commit()
            print(f"✅ Avaliações: {count} inseridas de {len(df)}")

        print("\n🎉 Seed concluído com sucesso!")

    except Exception as e:
        db.rollback()
        print(f"❌ Erro durante o seed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", default="./data", help="Pasta com os CSVs")
    args = parser.parse_args()
    seed(args.data_dir)